import express from "express";
import cors from "cors";

import { getTasks, updateTasks, createTask, deleteTask } from "./infra/db.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: false
}))

app.use(express.json());

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await getTasks();
        return res.status(200).json(tasks)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
        throw err
    }
})

app.put("/tasks", async (req, res) => {
    try {
        const { tasksToUpdate } = req.body;
        await updateTasks(tasksToUpdate);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    } finally {
        return res.status(200).json({ message: "Resource updated successfully" })
    }
})

app.post("/tasks", async (req, res) => {
    try {
        const taskContent = req.body;
        const newTask = await createTask(taskContent);
        return res.status(201).json(newTask)
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
        throw err
    }
})

app.delete("/tasks", async (req, res) => {
    try {
        const { taskId } = req.body;
        const deletedTask = await deleteTask(taskId);
        return res.status(200).json(deletedTask)
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
})


const PORT = 3030
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/ ...`)
})