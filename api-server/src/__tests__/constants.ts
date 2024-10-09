import { PaymentStatus } from "payment-gw-lib";

export const mockCards = {
  amex: "345936346788903",
  visa: "4024007198964305",
  mastercard: "5456060454627409",
  discover: "6011747817053283",
};

export const mockOrderDto = {
  customerName: "John Doe",
  paymentDetails: {
    amount: "101",
    currency: "USD",
    cardHolderName: "John Doe",
    cardNumber: "4111111111111111",
    cardExpirationMonth: "06",
    cardExpirationYear: "2020",
    cardCCV: "203",
  },
};

export const mockStandardizedPaymentResponse = {
  status: PaymentStatus.SUCCESS,
  gateway: "paypal",
  referenceId: "123",
  referenceIdType: "transaction",
  gatewayResponse: "abc",
  message: "hello world",
};

export const mockOrder = {
  customerName: mockOrderDto.customerName,
  amount: mockOrderDto.paymentDetails.amount,
  currency: mockOrderDto.paymentDetails.currency,
  referenceId: mockStandardizedPaymentResponse.referenceId,
  referenceIdType: mockStandardizedPaymentResponse.referenceIdType,
  gatewayResponse: mockStandardizedPaymentResponse.gatewayResponse,
};
