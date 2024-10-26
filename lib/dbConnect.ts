import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database.");
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("Please add the MONGODB_URI environment variable.");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default dbConnect;
