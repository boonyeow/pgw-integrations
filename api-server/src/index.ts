import express, { Express, Request, Response } from "express";
import { router as orderRoutes } from "./routes/orderRoutes";
import { sequelize } from "./db/db"; // Import the Sequelize instance from db.ts
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app: Express = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/order", orderRoutes);
app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
