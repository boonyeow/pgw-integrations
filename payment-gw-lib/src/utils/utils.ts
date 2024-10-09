import { HttpStatusCode } from "axios";
import { ApiResponse, CustomError, Order } from "@paypal/paypal-server-sdk";
import { Transaction, ValidatedResponse } from "braintree";

export enum PaymentStatus {
  SUCCESS = "success",
  ERROR = "error",
  // Add more payment status as needed
}

export enum PaymentErrorCode {
  INVALID_CARD = "invalid_card",
  INVALID_EXPIRATION_YEAR = "invalid_expiration_year",
  INVALID_EXPIRATION_MONTH = "invalid_expiration_month",
  HTTP_ERROR = "http_error",
  // Add more error codes as needed
}

export interface StandardizedPaymentResponse {
  status: PaymentStatus | string;
  httpStatusCode: HttpStatusCode | number;
  id?: string;
  idType?: string;
  message: string;
  errorCode?: PaymentErrorCode | string;
  gatewayResponse?: string; // Original gateway response for debugging
  gateway?: string;
  timestamp: Date;
}

export class PaymentResponseMapper {
  static fromBraintree(
    braintreeResponse: ValidatedResponse<Transaction>
  ): StandardizedPaymentResponse {
    if (braintreeResponse.success) {
      return {
        status: PaymentStatus.SUCCESS,
        httpStatusCode: HttpStatusCode.Ok,
        id: braintreeResponse.transaction.id,
        idType: "transaction",
        message: "Payment processed successfully",
        gateway: "braintree",
        gatewayResponse: JSON.stringify(braintreeResponse),
        timestamp: new Date(),
      };
    }

    let errorCode;
    let message = "Payment failed";

    if (braintreeResponse.errors?.deepErrors()) {
      const error = braintreeResponse.errors.deepErrors()[0];
      switch (error.code) {
        case "81715": // Invalid Card
          errorCode = PaymentErrorCode.INVALID_CARD;
          message =
            "Credit card number is invalid. It must pass a Luhn-10 check.";
          break;
        case "81712": // Invalid expiration month
          errorCode = PaymentErrorCode.INVALID_EXPIRATION_MONTH;
          message = "Expiration month is invalid. It must be 1-12 or 01-12.";
          break;
        case "81713": // Invalid expiration year
          errorCode = PaymentErrorCode.INVALID_EXPIRATION_YEAR;
          message =
            "Expiration year is invalid. It must be between 1975 and 2201";
        // Add more error mappings
      }
    }
    return {
      status: PaymentStatus.ERROR,
      httpStatusCode: HttpStatusCode.Ok,
      message,
      errorCode,
      gateway: "braintree",
      timestamp: new Date(),
    };
  }

  static fromPaypal(
    paypalResponse: ApiResponse<Order>
  ): StandardizedPaymentResponse {
    const result = paypalResponse.result;
    return {
      status: PaymentStatus.SUCCESS,
      httpStatusCode: HttpStatusCode.Ok,
      id: result.id,
      idType: "order",
      message: "Payment processed successfully",
      gateway: "paypal",
      gatewayResponse: JSON.stringify(paypalResponse.result),
      timestamp: new Date(),
    };
  }

  static fromPaypalError(error: CustomError): StandardizedPaymentResponse {
    return {
      status: `error`,
      httpStatusCode: error.statusCode,
      message: error.result!.message,
      gateway: "paypal",
      timestamp: new Date(),
    };
  }
}
