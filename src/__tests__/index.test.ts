import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";

const client = supertest(app);

describe("Testing the environment", () => {

    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost/test-chat-jest");
        console.log("Connected to Mongo")
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close();
    })

    it("should be able to test the environment", () => {
        expect(true).toBe(true);
    });

    it("should test that a test endpoint returns a sucess message", async () => {
        const response = await client.get("/test")

        expect(response.body.message).toBe("Success");
    })

    it("should test that we can create a new room using the POST /rooms endpoint", async () => {
        const response = await client.post("/rooms").send({ name: "blue" })
        expect(response.status).toBe(201);
    })

    it("should test that we can retrieve the previous messages from a /room/blue", async () => {
        const response = await client.get("/rooms/blue")

        expect(response.status).toBe(200);
        expect(response.body.messages).toBeDefined()
    })

})
