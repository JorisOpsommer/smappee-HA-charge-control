import "dotenv/config";
import express, { Express } from "express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import chargeInstructionRouter from "./routes/charge-instruction";
import { logger } from "./utils/logger";
import { overwriteSmappeesChargingState } from "./ticker/overwrite-smappees-charging-state";
import { ticker } from "./ticker/ticker";

const app: Express = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("combined"));
app.use("/charge-instruction", chargeInstructionRouter);

const swaggerJsDocOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "api",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/charge-instruction.*"],
};

const swaggerSpec = swaggerJSDoc(swaggerJsDocOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  logger.info("started the app!");
});

setInterval(() => ticker(), 1000 * 60 * 1);
setInterval(() => overwriteSmappeesChargingState(), 1000 * 60 * 1 * 5 + 1000);
