"use server"
import { getCollection } from "@/lib/mongodb"
import { createSupabaseServer } from "@/lib/supabase-server";
import { ObjectId } from "mongodb";

export async function fetchAllChats(){
    const supabase = await createSupabaseServer();
    const {data : {user},error} = await supabase.auth.getUser();
      if (error || !user) {
        console.log("No user found on server");
        return [];
      }
    const userId = user.id;
    
    const collection = await getCollection('chats');
    if(!collection) return [];

    let chats = await collection.find({userId:userId}).sort({updatedAt:-1}).toArray();
    chats = chats.map((chat) => ({...chat,_id:chat._id.toString()}))
    
    return chats;
}

export async function addMessage({userId,chatId,title,text,sender="user"}) {
    if(!text) return null;

    const collection = await getCollection("chats");
    if(!collection) return null;

    const userMessage = {text,sender,createdAt:new Date()};
    const botReplyText = await getBotResponseHF(text);
    const botMessage = {text:botReplyText,sender:"bot",createdAt:new Date()};

    if(!chatId){
        const newChat = {
                userId : userId,
                title: await generateChatTitleHF(text) || title,
                messages: [userMessage, botMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
        };
        const result = await collection.insertOne(newChat);
        return { ...newChat, _id: result.insertedId.toString() };
    }
    else {
        if (!ObjectId.isValid(chatId)) {
            console.error("Invalid chatId:", chatId);
            return null;
        }

        const objectId = new ObjectId(chatId);

        const updatedChat = await collection.findOneAndUpdate(
            { _id: objectId ,userId:userId},
            {
            $push: { messages: { $each: [userMessage, botMessage] } },
            $set: { updatedAt: new Date() },
            },
            { returnDocument: "after" } // return the updated document
        );
        
        if (!updatedChat) {
            console.error("findOneAndUpdate returned null. Possibly no match for:", objectId);
            return null;
        }

        return { ...updatedChat, _id: updatedChat._id.toString() };
        }


}

async function getBotResponseHF(message) {
  const API_URL = "https://router.huggingface.co/v1/chat/completions";
  const API_KEY = process.env.HF_API_KEY;

  const prompt = `
You are a dual-mode assistant:
1. If the input is a legal case summary in the trade secrets misappropriation domain, generate a structured 3-ply argument with sections:
   - "Plaintiff Argument"
   - "Defendant Argument"
   - "Plaintiff Counter"
   Output strictly in JSON format like:
   {
     "Plaintiff Argument": "...",
     "Defendant Argument": "...",
     "Plaintiff Counter": "..."
   }
2. If the input is a generic question outside this domain, respond normally as a helpful assistant.

Here is the user input:
"${message}"
`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`HF API Error (${res.status}):`, errorText);
      return "Sorry, I couldn't generate a response.";
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
  } catch (err) {
    console.error("Hugging Face API error:", err);
    return "Oops! Something went wrong.";
  }
}


async function generateChatTitleHF(message) {
  const API_URL = "https://router.huggingface.co/v1/chat/completions";
  const API_KEY = process.env.HF_API_KEY;

  const prompt = `Generate a concise chat title (1 line, max 50 chars) based on this message overall for a chat title:
"${message}"`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 20,
        temperature: 0.5
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`HF API Error (${res.status}):`, errorText);
      return message.slice(0, 50); // fallback
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content.slice(1,-1) || message.slice(0, 50);

  } catch (err) {
    console.error("HF API error:", err);
    return message.slice(0, 50); // fallback
  }
}
