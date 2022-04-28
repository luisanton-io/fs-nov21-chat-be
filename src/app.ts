import cors from "cors";
import express from "express";
import Room from "./rooms/model";
import { shared } from "./shared";

const app = express();

app.use(express.json())
app.use(cors())

app.post("/rooms", async (req, res) => {

    const { name } = req.body

    if (!name) {
        return res.status(400).send({ message: "name is required" })
    }

    const room = new Room({ name })
    await room.save()

    res.status(201).send(room)
})
app.get("/rooms/:name", async (req, res) => {

    const { name } = req.params
    const room = await Room.findOne({ name })


    if (!room) {
        return res.status(404).send({ message: "room not found" })
    }

    res.send(room)
})

app.get('/online-users', (req, res) => {
    res.send(shared.onlineUsers)
})

app.get("/test", (req, res) => {
    res.send({ message: "Success" });
}
)

export default app