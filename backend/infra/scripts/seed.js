import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Estudar React",
        content: "Focar em hooks e context API",
        totalTime: 600,          // 10 minutos
        remainingTime: 600,
        isDone: false,
      },
      {
        title: "Praticar Prisma",
        content: "Criar migrations e seed",
        totalTime: 1200,         // 20 minutos
        remainingTime: 800,
        isDone: false,
      },
      {
        title: "Revisar Cálculo",
        content: "Exercícios da lista 2",
        totalTime: 900,          // 15 minutos
        remainingTime: 0,
        isDone: true,
      },
    ],
  });

  console.log("✅ Tasks de teste criadas!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
