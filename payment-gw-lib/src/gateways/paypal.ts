import { PaymentDetails } from "../types/payment";
import {
  PaymentResponseMapper,
  StandardizedPaymentResponse,
} from "../utils/utils";
import { BasePaymentGateway } from "./base";
import {
  ApiResponse,
  CheckoutPaymentIntent,
  Client,
  CustomError,
  Environment,
  Order,
  OrderRequest,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import "crypto";

export class PaypalAdapter extends BasePaymentGateway {
  private client: any;
  constructor(environment: Environment, client_id: string, secret: string) {
    super();
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: client_id,
        oAuthClientSecret: secret,
      },
      environment: environment,
    });
  }

  processPayment = async (
    details: PaymentDetails
  ): Promise<StandardizedPaymentResponse> => {
    let orderController = new OrdersController(this.client);
    let orderRequest: OrderRequest = {
      intent: CheckoutPaymentIntent.CAPTURE,
      paymentSource: {
        card: {
          name: details.cardHolderName,
          number: details.cardNumber,
          securityCode: details.cardCCV,
          expiry: `${details.cardExpirationYear}-${details.cardExpirationMonth}`,
        },
      },
      purchaseUnits: [
        {
          amount: {
            currencyCode: details.currency,
            value: details.amount,
          },
        },
      ],
    };

    try {
      const res: ApiResponse<Order> = await orderController.ordersCreate({
        payPalRequestId: crypto.randomUUID(), // used to enforce idempotency on POST req; make it unique
        body: orderRequest,
      });
      return PaymentResponseMapper.fromPaypal(res);
    } catch (error) {
      throw error;
      // return PaymentResponseMapper.fromPaypalError(error as CustomError);
    }
  };
}
