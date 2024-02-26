import { HA_CHARGE_INSTRUCTION } from "../../../models/HA/ha-charge-instruction";

export let currentChargeInstruction: HA_CHARGE_INSTRUCTION =
  HA_CHARGE_INSTRUCTION.SUN;

export const setChargeInstruction = (state: HA_CHARGE_INSTRUCTION) => {
  currentChargeInstruction = state;
};
