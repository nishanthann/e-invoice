import * as dotenv from "dotenv";
dotenv.config();

const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
};

export default prismaConfig;

// // prisma.config.ts
// import * as dotenv from "dotenv";
// dotenv.config(); // ← ensures .env variables are loaded

// export default {
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: process.env.DATABASE_URL!,
//   },
// };
