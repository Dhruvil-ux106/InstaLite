const { defineConfig } = require("prisma/config");
const dotenv = require("dotenv");

dotenv.config();

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/instalite"
  }
});
