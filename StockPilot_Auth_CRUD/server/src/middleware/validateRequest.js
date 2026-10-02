import { validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array({ onlyFirstError: true }).map((error) => ({
    field: error.path || error.param || "request",
    message: error.msg,
  }));
  return res.status(400).json({ message: "Please correct the highlighted fields.", errors });
}
