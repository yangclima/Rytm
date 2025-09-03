import express from "express";
import cors from "cors";

import { getTasks } from "./infra/db.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: false
}))

app.use(express.json());

app.get("/tasks", async (req, res) => {
    const tasks = await getTasks();
    return res.status(200).json(tasks)
})

const PORT = 3030
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/ ...`)
})