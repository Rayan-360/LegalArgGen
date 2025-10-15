import "server-only"
import { MongoClient,ServerApiVersion } from "mongodb"

const client = new MongoClient(process.env.MONGO_DB_URI,{
    serverApi:{
        strict:true,
        deprecationErrors:true,
        version:ServerApiVersion.v1
    }
})

async function getDB(dbName){
    try{
        await client.connect();
        console.log("--------CONNECTED TO MONGODB---------");
        return client.db(dbName);
    }
    catch(err){
        console.log(err);
    }
}

export async function getCollection(collectionName){
        const db = await getDB('arg_gen');
        if(db){
            return db.collection(collectionName);
        }
        return null;
}