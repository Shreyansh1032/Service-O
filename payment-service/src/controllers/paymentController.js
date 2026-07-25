import * as paymentService from "../services/paymentService.js";
import { createPaymentSchema } from "../validators/paymentValidator.js";

export const create = async (req, res, next) => {
  try {
    const data = createPaymentSchema.parse(req.body);
    data.userId = req.user.id;
    data.userRole = req.user.role;

    const payment = await paymentService.createPayment(data);

    res.status(201).json({
      success: true,
      message: "Payment processed successfully",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id, req.user);
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

export const refund = async (req, res, next) => {
  try {
    const payment = await paymentService.refundPayment(req.params.id, req.user);
    res.json({ success: true, message: "Payment refunded successfully", data: payment });
  } catch (err) {
    next(err);
  }
};