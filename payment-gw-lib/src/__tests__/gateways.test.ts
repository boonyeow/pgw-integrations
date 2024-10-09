import { Environment as BTEnvironment } from "braintree";
import { BraintreeAdapter } from "../gateways/braintree";
import { PaypalAdapter } from "../gateways/paypal";
import { Environment as PPEnvironment } from "@paypal/paypal-server-sdk";
import { PaymentDetails } from "../types/payment";

describe("Braintree integration test", () => {
  let braintreeAdapter: BraintreeAdapter;

  beforeEach(() => {
    braintreeAdapter = new BraintreeAdapter(
      BTEnvironment.Sandbox,
      process.env.BRAINTREE_MERCHANT_ID!,
      process.env.BRAINTREE_PUBLIC_KEY!,
      process.env.BRAINTREE_PRIVATE_KEY!
    );
  });

  afterEach(() => {
    braintreeAdapter;
  });

  const paymentDetails: PaymentDetails = {
    amount: "101",
    currency: "USD",
    cardHolderName: "John Doe",
    cardNumber: "4111111111111111",
    cardExpirationMonth: "06",
    cardExpirationYear: "2020",
    cardCCV: "203",
  };
  it("Happy path - payment processed successfully", async () => {
    const result = await braintreeAdapter.processPayment(paymentDetails);
    expect(result.status).toBe("success");
  });

  it("Unhappy path - invalid card number", async () => {
    let tmp = { ...paymentDetails };
    tmp.cardNumber = "411111111111";
    const result = await braintreeAdapter.processPayment(tmp);
    expect(result.status).toBe("error");
  });

  // Add tests as needed
});

describe("Paypal integration test", () => {
  let paypalAdapter: PaypalAdapter;

  beforeEach(() => {
    paypalAdapter = new PaypalAdapter(
      PPEnvironment.Sandbox,
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_SECRET!
    );
  });

  const paymentDetails: PaymentDetails = {
    amount: "100",
    currency: "USD",
    cardHolderName: "John Doe",
    cardNumber: "4032038381427883",
    cardExpirationMonth: "07",
    cardExpirationYear: "2027",
    cardCCV: "942",
  };

  it("Happy path - payment processed successfully", async () => {
    const result = await paypalAdapter.processPayment(paymentDetails);
    expect(result.status).toBe("success");
  });

  it("Unhappy path - invalid card number", async () => {
    let tmp = { ...paymentDetails };
    tmp.cardNumber = "";
    const result = await paypalAdapter.processPayment(tmp);
    expect(result.status).toBe("error");
  });

  // Add tests as needed
});
