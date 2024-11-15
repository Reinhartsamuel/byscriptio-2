import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/drizzle/schema.js",
  out: "./app/drizzle/migrations",
  dbCredentials : {
    // eslint-disable-next-line no-undef
    url : process.env.POSTGRES_DATABASE_URL,
    ssl:{
      rejectUnauthorized: false,  // You can try this option for SSL issues
    },
  }
});