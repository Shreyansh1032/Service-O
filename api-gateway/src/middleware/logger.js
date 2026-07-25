import morgan from "morgan";

morgan.token("id", (req) => req.id);

const logger = morgan(":id :method :url :status :response-time ms - :res[content-length]");

export default logger;