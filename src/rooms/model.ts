import mongoose from "mongoose";

type Message = {
    text: string;
    sender: {
        username: string;
    },
    timestamp: number;
}

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: {
            username: {
                type: String,
                required: true
            }
        },
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
})

type Room = {
    name: string
    messages: Message[]
}

const RoomSchema = new mongoose.Schema<Room>({
    name: {
        type: String,
        required: true,
    },
    messages: {
        type: [MessageSchema]
    }
})

const Room = mongoose.model('rooms', RoomSchema)

export default Room