import { BraintreeAdapter, PaymentStatus, PaypalAdapter } from "payment-gw-lib";
import { CreateOrderDto } from "../types/order";
import { getGateway } from "../utils/utils";
import { Order } from "../db/models/order.model";

export class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<any> {
    let gw = getGateway(
      dto.paymentDetails.currency,
      dto.paymentDetails.cardNumber
    );
    if (gw === undefined) {
      throw new Error("Payment gateway not found for provided currency/card");
    }
    let res = await gw.processPayment(dto.paymentDetails);
    if (res.status == PaymentStatus.SUCCESS) {
      try {
        const newOrder = await Order.create({
          customerName: dto.customerName,
          amount: dto.paymentDetails.amount,
          currency: dto.paymentDetails.currency,
          gateway: res.gateway,
          referenceId: res.id,
          referenceIdType: res.idType,
          gatewayResponse: res.gatewayResponse,
        });
        return {
          message: "Order successfully created!",
          paymentStatus: res.status,
          order: newOrder,
        };
      } catch (error) {
        // Return as long as payment is successful but log the error and DTO so we can retry later on
        console.error("Payment success but order creation failed", error);
        console.error(dto);

        return {
          message: "Payment succeeded, but order creation pending.",
          paymentStatus: res.status,
        };
      }
    }
    throw new Error(res.message);
  }
}
