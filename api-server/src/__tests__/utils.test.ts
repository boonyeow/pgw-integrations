import { SupportedCurrency } from "../utils/constants";
import { getGateway } from "../utils/utils";
import { mockCards } from "./constants";

describe("Unit tests for Utils - getGateway", () => {
  it("Happy path - paypal - supported currency, supported card number", () => {
    const gw = getGateway(SupportedCurrency.USD, mockCards.amex);
    expect(gw!.constructor.name).toBe("PaypalAdapter");
  });

  it("Happy path - braintree - supported currency, supported card number", () => {
    const gw = getGateway(SupportedCurrency.SGD, mockCards.mastercard);
    expect(gw!.constructor.name).toBe("BraintreeAdapter");
  });

  it("Unhappy path - supported currency but card number fails luhn check", () => {
    const gw = getGateway(SupportedCurrency.AUD, "000");
    expect(gw).toBe(undefined);
  });

  it("Unhappy path - supported currency but card number not supported", () => {
    const gw = getGateway(SupportedCurrency.AUD, mockCards.amex);
    expect(gw).toBe(undefined);
  });

  it("Unhappy path - supported card number but currency not supported", () => {
    const gw = getGateway("ABC", mockCards.mastercard);
    expect(gw).toBe(undefined);
  });
});
