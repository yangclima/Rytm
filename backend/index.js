import express from "express";
import cors from "cors";

import { getTasks, updateTasks } from "./infra/db.js";

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

app.put("/tasks", async (req, res) => {
    try {
        const { tasksToUpdate } = req.body;
        await updateTasks(tasksToUpdate);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error"})
    } finally {
        return res.status(200).json({ message: "Resource updated successfully"})
    }
})

const PORT = 3030
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/ ...`)
})