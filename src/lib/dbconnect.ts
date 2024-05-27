import mongoose from "mongoose";

type ConnectionObject={
    isConnected ?:number
}
const connection :ConnectionObject ={}

export default async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to db");
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URI || '',{})
        connection.isConnected=db.connections[0].readyState
        console.log("db connected successfully");
    } catch (error) {
        console.error("db connection failed",error);
        process.exit(1)
    }
}

