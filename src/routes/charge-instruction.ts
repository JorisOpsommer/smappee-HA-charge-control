import express, { Request, Response } from "express";
import {
  currentChargeInstruction,
  setChargeInstruction,
} from "../domain/HA/charging-instruction/current-charging-instruction";
import {
  currentChargingState,
  lastUpdatedChargingState,
} from "../domain/smappee/charging/current-charging-state";
import { HA_CHARGE_INSTRUCTION } from "../models/HA/ha-charge-instruction";

const chargeInstructionRouter = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
chargeInstructionRouter.get("/", async (req: Request, res: Response) => {
  res.send({
    currentChargeInstruction,
    currentChargingState,
    lastUpdatedChargingState,
  });
});

chargeInstructionRouter.post("/", async (req: Request, res: Response) => {
  const newInstruction: { chargeInstruction: HA_CHARGE_INSTRUCTION } = req.body;
  setChargeInstruction(newInstruction.chargeInstruction);

  res.send(`changed mode to ${currentChargeInstruction}`);
});

export default chargeInstructionRouter;
