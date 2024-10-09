import { PaymentDetails } from "../types/payment";

export abstract class BasePaymentGateway {
  protected constructor() {}
  abstract processPayment(details: PaymentDetails): Promise<any>;
}
