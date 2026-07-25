import { randomUUID } from "crypto";

const requestId = (req, res, next) => {
  const id = req.headers["x-request-id"] || randomUUID();

  req.id = id;
  req.headers["x-request-id"] = id; // forwarded to downstream services via proxy
  res.setHeader("x-request-id", id); // visible to the client too

  next();
};

export default requestId;