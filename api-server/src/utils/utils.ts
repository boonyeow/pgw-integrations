import { Environment as BTEnvironment } from "braintree";
import { Environment as PPEnvironment } from "@paypal/paypal-server-sdk";
import { BraintreeAdapter } from "payment-gw-lib/src/gateways/braintree";
import { PaypalAdapter } from "payment-gw-lib/src/gateways/paypal";
import { CardType, SupportedCurrency } from "./constants";
import creditCardType from "credit-card-type";

export function isCurrencySupported(currency: string): boolean {
  return Object.values(SupportedCurrency).includes(
    currency as SupportedCurrency
  );
}

export function getGateway(
  currency: string,
  cardNumber: string
): PaypalAdapter | BraintreeAdapter | undefined {
  const cardCandidates = creditCardType(cardNumber);
  if (
    cardCandidates.length == 0 ||
    !isCurrencySupported(currency) ||
    (currency != SupportedCurrency.USD &&
      cardCandidates[0].type == CardType["american-express"])
  ) {
    return undefined;
  }

  if (
    currency == SupportedCurrency.USD ||
    currency == SupportedCurrency.EUR ||
    currency == SupportedCurrency.AUD
  ) {
    return new PaypalAdapter(
      PPEnvironment.Sandbox,
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_SECRET!
    );
  }
  return new BraintreeAdapter(
    BTEnvironment.Sandbox,
    process.env.BRAINTREE_MERCHANT_ID!,
    process.env.BRAINTREE_PUBLIC_KEY!,
    process.env.BRAINTREE_PRIVATE_KEY!
  );
}
