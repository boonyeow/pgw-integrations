export type PaymentDetails = {
  amount: string;
  currency: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardCCV: string;
  paymentMethodNonce?: string;
};

export type PaymentResult = {
  id?: string;
  status: "success" | "failed";
  message: string;
};
