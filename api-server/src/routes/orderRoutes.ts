import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const router = Router();
const orderController = new OrderController();
router.post("/", orderController.createOrder);

export { router };
