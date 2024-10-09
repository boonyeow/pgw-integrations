// describe("Unit tests for order service", () => {});

import { PaymentStatus, PaypalAdapter } from "payment-gw-lib";
import { OrderService } from "../services/orderService";
import {
  mockCards,
  mockOrder,
  mockOrderDto,
  mockStandardizedPaymentResponse,
} from "./constants";
import { SupportedCurrency } from "../utils/constants";
import { getGateway } from "../utils/utils";
import { Order } from "../db/models/order.model";

jest.mock("../utils/utils", () => ({
  getGateway: jest.fn(),
}));
jest.mock("../db/models/order.model", () => ({
  Order: {
    create: jest.fn(),
  },
}));

describe("Unit tests for Order Service - createOrder", () => {
  let orderService: OrderService;
  let mockGetGateway = getGateway as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService();
  });

  it("Happy path - Both order and payment are successful", async () => {
    let mockGateway = {
      processPayment: jest
        .fn()
        .mockResolvedValue(mockStandardizedPaymentResponse),
    };

    mockGetGateway.mockReturnValue(mockGateway);
    const result = await orderService.createOrder(mockOrderDto);

    // Assert the correct response is returned
    expect(result).toEqual({
      message: "Order successfully created!",
      paymentStatus: PaymentStatus.SUCCESS,
    });
    // Ensure processPayment and Order.create were called
    expect(mockGateway.processPayment).toHaveBeenCalledWith(
      mockOrderDto.paymentDetails
    );
    expect(Order.create).not.toHaveBeenCalledWith(mockOrder);
  });

  it("Unhappy path - Payment gateway not found", async () => {
    mockGetGateway.mockReturnValue(undefined);
    let tmp = { ...mockOrderDto };
    tmp.paymentDetails.currency = SupportedCurrency.AUD;
    tmp.paymentDetails.cardNumber = mockCards.amex;

    await expect(orderService.createOrder(tmp)).rejects.toThrow(
      "Payment gateway not found for provided currency/card"
    );
    expect(mockGetGateway).toHaveBeenCalledWith(
      tmp.paymentDetails.currency,
      tmp.paymentDetails.cardNumber
    );
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("Unhappy path - Payment success but order creation failed", async () => {
    let mockGateway = {
      processPayment: jest
        .fn()
        .mockResolvedValue(mockStandardizedPaymentResponse),
    };
    mockGetGateway.mockReturnValue(mockGateway);

    // Throw error when order.create called
    (Order.create as jest.Mock).mockRejectedValue(new Error("Database error"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await orderService.createOrder(mockOrderDto);

    // Assert the correct response is returned
    expect(result).toEqual({
      message: "Payment succeeded, but order creation pending.",
      paymentStatus: PaymentStatus.SUCCESS,
    });

    // Ensure processPayment and Order.create were called
    expect(mockGateway.processPayment).toHaveBeenCalledWith(
      mockOrderDto.paymentDetails
    );
    expect(Order.create).not.toHaveBeenCalledWith(mockOrder);

    // Make sure error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Payment success but order creation failed",
      expect.any(Error)
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockOrderDto);

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });

  it("Unhappy path - Payment failed", async () => {
    let tmp = { ...mockStandardizedPaymentResponse };
    tmp.status = PaymentStatus.ERROR;
    let mockGateway = {
      processPayment: jest.fn().mockResolvedValue(tmp),
    };
    mockGetGateway.mockReturnValue(mockGateway);

    expect(orderService.createOrder(mockOrderDto)).rejects.toThrow();
    expect(Order.create).not.toHaveBeenCalled();
  });
});
