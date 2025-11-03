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
  const botReplyText = await getBotResponse(text);
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

// New: Add only the user's message immediately (no bot generation yet)
export async function addUserOnlyMessage({ userId, chatId, text, title }) {
  if (!text) return null;
  const collection = await getCollection("chats");
  if (!collection) return null;

  const userMessage = { text, sender: "user", createdAt: new Date() };

  if (!chatId) {
    // Create a new chat with just the user message
    const newChat = {
      userId,
      title: title || (await generateChatTitleHF(text)) || text.slice(0, 50),
      messages: [userMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(newChat);
    return { ...newChat, _id: result.insertedId.toString() };
  } else {
    if (!ObjectId.isValid(chatId)) {
      console.error("Invalid chatId:", chatId);
      return null;
    }
    const objectId = new ObjectId(chatId);
    const updatedChat = await collection.findOneAndUpdate(
      { _id: objectId, userId },
      {
        $push: { messages: userMessage },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );
    if (!updatedChat) return null;
    return { ...updatedChat, _id: updatedChat._id.toString() };
  }
}

// New: Generate bot reply and append it to an existing chat
export async function generateAndAppendBotMessage({ userId, chatId, userText }) {
  if (!userText) return null;
  const collection = await getCollection("chats");
  if (!collection) return null;
  if (!ObjectId.isValid(chatId)) {
    console.error("Invalid chatId:", chatId);
    return null;
  }

  const botReplyText = await getBotResponse(userText);
  const botMessage = { text: botReplyText, sender: "bot", createdAt: new Date() };
  const objectId = new ObjectId(chatId);
  const updatedChat = await collection.findOneAndUpdate(
    { _id: objectId, userId },
    {
      $push: { messages: botMessage },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" }
  );
  if (!updatedChat) return null;
  return { ...updatedChat, _id: updatedChat._id.toString() };
}

// Delete a chat by id (scoped to the authenticated user)
export async function deleteChat({ userId, chatId }) {
  if (!chatId || !userId) return false;
  const collection = await getCollection("chats");
  if (!collection) return false;
  if (!ObjectId.isValid(chatId)) {
    console.error("Invalid chatId:", chatId);
    return false;
  }
  const objectId = new ObjectId(chatId);
  const result = await collection.deleteOne({ _id: objectId, userId });
  return result?.deletedCount === 1;
}

// Classify the user prompt and route to either the backend pipeline (trade secret 3-ply)
// or fallback to generic HF response. Also detect optional c2/c3 summaries inside the text.
async function getBotResponse(message) {
  // First: pre-extract c2/c3 from natural language hints ("plaintiff precedent", "defendant precedent", etc.)
  const { c2Hint, c3Hint } = preExtractC2C3(message);
  try {
    console.log("[preExtractC2C3] c2.len=", c2Hint?.length || 0, "c3.len=", c3Hint?.length || 0);
  } catch {}
  // Then classify and extract summaries using HF (we'll pass the hints)
  const classification = await classifyPromptHF(message, { c2Hint, c3Hint });
  try {
    console.log("[classifyPromptHF] result:", classification);
  } catch {}

  // If the user intent is pipeline and domain is trade_secret, call our backend
  if (classification?.intent === "pipeline" && classification?.domain === "trade_secret" && classification?.c1_summary) {
    try {
      const pipelineBody = {
        c1_summary: classification.c1_summary,
        ...(classification.c2_summary ? { c2_summary: classification.c2_summary } : (c2Hint ? { c2_summary: c2Hint } : {})),
        ...(classification.c3_summary ? { c3_summary: classification.c3_summary } : (c3Hint ? { c3_summary: c3Hint } : {})),
      };

      const res = await fetch(process.env.BACKEND_PIPELINE_URL || "http://localhost:8000/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pipelineBody),
        // Next.js server action: avoid caching
        cache: "no-store",
      });
      try {
        console.log("[pipeline] body c1.len=", pipelineBody.c1_summary?.length || 0, 
          "c2.len=", pipelineBody.c2_summary?.length || 0, "c3.len=", pipelineBody.c3_summary?.length || 0);
        console.log("[pipeline] response status:", res.status);
      } catch {}

      if (!res.ok) {
        const txt = await res.text();
        console.error(`Pipeline error (${res.status}):`, txt);
        return "Sorry, the legal pipeline failed to generate a response.Please try again later.";
      }

      const data = await res.json();

      // Prefer polished outputs if available; else use generated arguments
      const polished = data?.step4_polisher?.reports;
      const gen = data?.step2_arguments?.arguments;

      const pArg = polished?.Plaintiff_Argument?.final_argument ?? gen?.Plaintiff_Argument ?? "";
      const dArg = polished?.Defendant_Counterargument?.final_argument ?? gen?.Defendant_Counterargument ?? "";
      const rArg = polished?.Plaintiff_Rebuttal?.final_argument ?? gen?.Plaintiff_Rebuttal ?? "";

      // If any is TERMINATE, show that explicitly
      const fmt = (label, text) => (text === "TERMINATE" ? `${label}: TERMINATE (abstained)` : `${label}: ${text}`);

      return `Here is your 3-Ply Legal Arguments\n\n${fmt("Plaintiff's Argument", pArg)}\n\n${fmt("Defendant's Counterargument", dArg)}\n\n${fmt("Plaintiff's Rebuttal", rArg)}`;
    } catch (err) {
      console.error("Pipeline invocation error:", err);
      return "Sorry, I couldn't complete the legal analysis pipeline. Please try again later.";
    }
  }

  // If classifier says it's a legal case but not trade secret, provide a fallback message
  if (classification?.intent === "pipeline" && classification?.domain !== "trade_secret") {
    try { console.log("[router] Non-trade-secret detected, skipping pipeline", classification?.domain); } catch {}
    return "This case doesn’t appear to be a trade secret misappropriation under our 26-factor rubric. I can still help with a general response if you’d like.";
  }

  // Otherwise: generic assistant reply via HF
  try { console.log("[router] Using generic assistant path"); } catch {}
  return await getGenericHFReply(message);
}

// Use HF to classify if message is a trade secret case summary and extract c1/c2/c3 summaries if present.
async function classifyPromptHF(message, hints = {}) {
  const API_URL = "https://router.huggingface.co/v1/chat/completions";
  const API_KEY = process.env.HF_API_KEY;

  const prompt = `
You are a strict classifier and extractor. The user message contains a legal case summary and may also contain plaintiff and defendant precedent cases.

Your task:
1. Extract ONLY the main case summary as "c1_summary" (the case being analyzed)
2. Extract the plaintiff's precedent case as "c2_summary" (if present)
3. Extract the defendant's precedent case as "c3_summary" (if present)
4. Determine if this is about trade secret misappropriation

IMPORTANT: 
- c1_summary should ONLY contain the main case facts, NOT the precedents
- Look for markers like "plaintiff precedent:", "defendant precedent:", "c2:", "c3:" to separate the precedents from the main case
- The main case is usually at the beginning before any precedent mentions

Return JSON in this exact format:
{
  "intent": "pipeline" | "generic",
  "domain": "trade_secret" | "other",
  "c1_summary": "main case summary only",
  "c2_summary": "plaintiff precedent case if present",
  "c3_summary": "defendant precedent case if present"
}

User message:
"""
${message}
"""
`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,  // Increased to handle larger extractions
        temperature: 0.0,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`HF classify API Error (${res.status}):`, errorText);
      return { intent: "generic", domain: "other", c1_summary: "", c2_summary: "", c3_summary: "" };
    }

    const data = await res.json();
    let content = data?.choices?.[0]?.message?.content || "";
    try { console.log("[classifyPromptHF] raw content:", content); } catch {}

    // Strip common code fences the model might add
    content = stripCodeFences(content);

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      try { console.warn("[classifyPromptHF] JSON.parse failed, try regex extraction:", e?.message); } catch {}
      const m = content.match(/\{[\s\S]*\}/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch {}
      }
    }

    if (parsed && typeof parsed === 'object') {
      const normalized = {
        intent: parsed.intent === "pipeline" ? "pipeline" : "generic",
        domain: parsed.domain === "trade_secret" ? "trade_secret" : "other",
        c1_summary: typeof parsed.c1_summary === "string" ? parsed.c1_summary.trim() : "",
        c2_summary: typeof parsed.c2_summary === "string" ? parsed.c2_summary.trim() : "",
        c3_summary: typeof parsed.c3_summary === "string" ? parsed.c3_summary.trim() : "",
      };
      
      // Use hints as fallback ONLY if LLM didn't extract them
      if (!normalized.c2_summary && hints.c2Hint) {
        normalized.c2_summary = hints.c2Hint;
      }
      if (!normalized.c3_summary && hints.c3Hint) {
        normalized.c3_summary = hints.c3Hint;
      }

      // Clean up c1 if it still contains the full message with precedents
      if (normalized.c1_summary && normalized.c1_summary.length > 500) {
        // Try to extract just the main case by stopping at precedent markers
        const cleanedC1 = extractCleanC1(normalized.c1_summary);
        if (cleanedC1 && cleanedC1.length >= 120) {
          normalized.c1_summary = cleanedC1;
        }
      }

      // If c1 seems too short (likely just an instruction), try to extract likely c1 from the message body
      if (!normalized.c1_summary || normalized.c1_summary.trim().length < 120) {
        const likely = extractLikelyC1(message);
        if (likely && likely.length >= 120) normalized.c1_summary = likely;
      }
      
      // Keyword override if classifier mislabels
      if (normalized.domain !== "trade_secret" && detectTradeSecretKeywords(message)) {
        normalized.domain = "trade_secret";
        if (!normalized.c1_summary) normalized.c1_summary = extractCleanC1(message) || message;
      }
      
      return normalized;
    }

    // Total failure: fall back to keyword-based default with manual extraction
    const isTS = detectTradeSecretKeywords(message);
    let fallbackC1 = "";
    let fallbackC2 = hints.c2Hint || "";
    let fallbackC3 = hints.c3Hint || "";
    
    if (isTS) {
      fallbackC1 = extractCleanC1(message) || extractLikelyC1(message) || message;
    }
    
    return { 
      intent: isTS ? "pipeline" : "generic", 
      domain: isTS ? "trade_secret" : "other", 
      c1_summary: fallbackC1, 
      c2_summary: fallbackC2, 
      c3_summary: fallbackC3 
    };
  } catch (err) {
    console.error("HF classify error:", err);
    return { intent: "generic", domain: "other", c1_summary: "", c2_summary: "", c3_summary: "" };
  }
}

// New helper function to extract clean c1 by stopping at precedent markers
function extractCleanC1(text) {
  if (!text || typeof text !== "string") return "";
  
  // Remove any leading instruction text
  let cleaned = text.replace(/^.*?(?=In the case of|[A-Z][a-z]+\s+v\.\s+[A-Z])/i, '');
  
  // Stop at precedent markers
  const stopMarkers = [
    /\bplaintiff(?:'s)?\s+precedent\s*[:\-]/i,
    /\bdefendant(?:'s)?\s+precedent\s*[:\-]/i,
    /\bc2\s*[:\-]/i,
    /\bc3\s*[:\-]/i,
    /\bthis\s+is\s+the\s+plaintiff/i,
    /\bthis\s+is\s+the\s+defendant/i
  ];
  
  let earliestStop = cleaned.length;
  for (const marker of stopMarkers) {
    const match = marker.exec(cleaned);
    if (match && match.index < earliestStop) {
      earliestStop = match.index;
    }
  }
  
  cleaned = cleaned.slice(0, earliestStop).trim();
  
  // Clean quotes/backticks
  cleaned = cleaned.replace(/^"+|"+$/g, "").replace(/^`+|`+$/g, "").trim();
  
  return cleaned;
}

// Generic HF assistant reply (fallback path)
async function getGenericHFReply(message) {
  const API_URL = "https://router.huggingface.co/v1/chat/completions";
  const API_KEY = process.env.HF_API_KEY;

  const prompt = `You are a helpful assistant. Answer the user's message naturally and concisely.\n\nUser: ${message}`;

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

function stripCodeFences(s) {
  if (!s || typeof s !== "string") return s;
  return s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

function detectTradeSecretKeywords(message) {
  if (!message || typeof message !== "string") return false;
  const m = message.toLowerCase();
  const keywords = [
    "trade secret", "misappropriation", "nda", "non-disclosure", "confidential", "proprietary",
    "reverse engineer", "reverse-engineer", "reverse engineering", "independent development",
    "disclosure", "secrecy", "confidentiality", "restrict", "access control"
  ];
  return keywords.some(k => m.includes(k));
}

// Heuristic to extract the most likely c1 summary from a mixed instruction + case text.
function extractLikelyC1(message) {
  if (!message || typeof message !== "string") return "";
  const text = message.trim();
  // Prefer paragraphs with multiple sentences and legal markers
  const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  let best = "";
  for (const p of paras) {
    const score = (p.match(/[\.\!\?]/g) || []).length + (/(in the case of|v\.|plaintiff|defendant|court|alleged)/i.test(p) ? 2 : 0) + Math.min(3, Math.floor(p.length / 200));
    if (score > ((best.match(/[\.\!\?]/g) || []).length + Math.min(3, Math.floor(best.length / 200)))) {
      best = p;
    }
  }
  // If no paragraph split, attempt to find from common opener
  if (!best) {
    const m = text.match(/(In the case of[\s\S]+)/i);
    if (m) best = m[1].trim();
  }
  // Clean quotes/backticks
  best = best.replace(/^"+|"+$/g, "").replace(/^`+|`+$/g, "").trim();
  return best;
}

// Heuristic pre-parser for natural-language c2/c3 (plaintiff/defendant precedent) hints
function preExtractC2C3(message) {
  if (!message || typeof message !== "string") {
    return { c2Hint: "", c3Hint: "" };
  }

  const text = message.trim();
  const lower = text.toLowerCase();

  // Helper to capture a section after a marker up to next obvious marker or double newline
  const captureAfter = (pattern) => {
    const m = pattern.exec(text);
    if (!m) return "";
    const start = m.index + m[0].length;
    const remainder = text.slice(start);
    // Stop at common boundaries
    const boundary = /\n\s*(?:plaintiff|defendant|c2\b|c3\b|rebuttal|counter|analysis|summary)\s*[:\-]?|\n\n|$/i;
    const b = boundary.exec(remainder);
    const end = b ? b.index : remainder.length;
    const chunk = remainder.slice(0, end).trim();
    return chunk.length >= 30 ? chunk : ""; // avoid tiny fragments
  };

  // Patterns for plaintiff (c2)
  const c2Patterns = [
    /plaintiff(?:'s)?\s+(?:precedent|case|example|summary)\s*[:\-]\s*/i,
    /this\s+is\s+the\s+plaintiff(?:'s)?\s+precedent(?:\s+case)?\s*[:\-]?\s*/i,
    /\bc2\b\s*[:\-]\s*/i
  ];
  // Patterns for defendant (c3)
  const c3Patterns = [
    /defendant(?:'s)?\s+(?:precedent|case|example|summary)\s*[:\-]\s*/i,
    /this\s+is\s+the\s+defendant(?:'s)?\s+precedent(?:\s+case)?\s*[:\-]?\s*/i,
    /\bc3\b\s*[:\-]\s*/i
  ];

  let c2Hint = "";
  for (const p of c2Patterns) {
    c2Hint = captureAfter(p);
    if (c2Hint) break;
  }

  let c3Hint = "";
  for (const p of c3Patterns) {
    c3Hint = captureAfter(p);
    if (c3Hint) break;
  }

  return { c2Hint, c3Hint };
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
