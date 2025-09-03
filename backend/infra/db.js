import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getTasks() {
    const tasks = await prisma.task.findMany();
    return tasks
}

export async function updateTasks(tasksToUpdate) {
    tasksToUpdate.map(async (task) => {
        await prisma.task.updateMany({
            where: {id: task.id},
            data: {
                remainingTime: task.remainingTime,
                isDone: task.isDone,
            }
        })
    })
}

export async function createTask(taskContent) {
    const newTask = await prisma.task.create({
        data: taskContent
    })

    return newTask;
}

export async function deleteTask(taskId) {
    const deletedTask = await prisma.task.delete({
        where: {id: taskId}
    })

    return deletedTask;
}