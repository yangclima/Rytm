import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getTasks() {
    const tasks = await prisma.task.findMany();
    return tasks
}