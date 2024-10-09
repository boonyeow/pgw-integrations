import { PaymentDetails } from "payment-gw-lib/build/types/payment.d";
export interface CreateOrderDto {
  paymentDetails: PaymentDetails;
  customerName: string;
}
