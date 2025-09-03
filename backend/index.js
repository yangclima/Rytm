import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173/",
    credentials: false
}))

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({success: true})
})

const PORT = 3030
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/ ...`)
})