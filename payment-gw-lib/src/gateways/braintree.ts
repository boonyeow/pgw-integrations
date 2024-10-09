import {
  BraintreeGateway,
  Environment,
  Transaction,
  ValidatedResponse,
} from "braintree";
import { PaymentDetails } from "../types/payment";
import { BasePaymentGateway } from "./base";
import {
  PaymentResponseMapper,
  StandardizedPaymentResponse,
} from "../utils/utils";

export class BraintreeAdapter extends BasePaymentGateway {
  private gateway: BraintreeGateway;
  constructor(
    environment: Environment,
    merchantId: string,
    publicKey: string,
    privateKey: string
  ) {
    super();
    this.gateway = new BraintreeGateway({
      environment: environment,
      merchantId: merchantId,
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }

  processPayment = async (
    details: PaymentDetails
  ): Promise<StandardizedPaymentResponse> => {
    try {
      const res: ValidatedResponse<Transaction> =
        await this.gateway.transaction.sale({
          amount: details.amount,
          paymentMethodNonce: details.paymentMethodNonce,
          creditCard: {
            cardholderName: details.cardHolderName,
            cvv: details.cardCCV,
            expirationMonth: details.cardExpirationMonth,
            expirationYear: details.cardExpirationYear,
            number: details.cardNumber,
          },
          options: {
            submitForSettlement: true, // Immediately submit for settlement
          },
        });
      return PaymentResponseMapper.fromBraintree(res);
    } catch (error) {
      console.error("Payment processing failed:", error);
      throw error;
    }
  };
}
