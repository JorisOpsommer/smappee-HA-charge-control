import { HA_CHARGE_INSTRUCTION } from "../models/HA/ha-charge-instruction";
import { CHARGE_STATE } from "../models/smappee/charge-state-enum";
import { updateChargingMode } from "../domain/smappee/charging/updateChargingMode";
import { logger } from "../utils/logger";

export const decisionMaker = (
  sensorPowerConsumedInWatt: number,
  sensorInverterSolarInWatt: number,
  currentChargingState: CHARGE_STATE,
  currentChargeInstruction: HA_CHARGE_INSTRUCTION
) => {
  logger.info({
    sensorPowerConsumedInWatt,
    sensorInverterSolarInWatt,
    currentChargingState,
    currentChargeInstruction,
  });
  switch (currentChargeInstruction) {
    case HA_CHARGE_INSTRUCTION.SLOW:
      decisionSlowCharge(
        sensorPowerConsumedInWatt,
        sensorInverterSolarInWatt,
        currentChargingState
      );
      break;
    case HA_CHARGE_INSTRUCTION.SUN:
      decissionSunCharge(
        sensorPowerConsumedInWatt,
        sensorInverterSolarInWatt,
        currentChargingState
      );
      break;
    case HA_CHARGE_INSTRUCTION.TURBO:
      decissionTurboCharge(currentChargingState);
      break;
  }
};

const decisionSlowCharge = async (
  sensorPowerConsumedInWatt: number,
  sensorInverterSolarInWatt: number,
  currentChargingState: CHARGE_STATE
) => {
  if (currentChargingState === CHARGE_STATE.PAUSED) {
    if (
      (sensorPowerConsumedInWatt < 800 && sensorInverterSolarInWatt <= 2000) ||
      (sensorPowerConsumedInWatt < 1000 && sensorInverterSolarInWatt > 2000)
    ) {
      await updateChargingMode(CHARGE_STATE.SLOW);
    }
  } else if (currentChargingState === CHARGE_STATE.SLOW) {
    if (
      (sensorPowerConsumedInWatt > 4800 && sensorInverterSolarInWatt <= 2000) ||
      sensorPowerConsumedInWatt > 5000
    ) {
      await updateChargingMode(CHARGE_STATE.PAUSED);
    }
  }

  if (currentChargingState === CHARGE_STATE.TURBO)
    await updateChargingMode(CHARGE_STATE.PAUSED, false);
};

const decissionSunCharge = async (
  sensorPowerConsumedInWatt: number,
  sensorInverterSolarInWatt: number,
  currentChargingState: CHARGE_STATE
) => {
  if (currentChargingState === CHARGE_STATE.PAUSED) {
    if (sensorPowerConsumedInWatt < 300 && sensorInverterSolarInWatt > 1100) {
      await updateChargingMode(CHARGE_STATE.SLOW);
    }
  }

  if (currentChargingState === CHARGE_STATE.SLOW) {
    if (sensorPowerConsumedInWatt > 4000 || sensorInverterSolarInWatt < 900) {
      await updateChargingMode(CHARGE_STATE.PAUSED);
    }
  }

  if (currentChargingState === CHARGE_STATE.TURBO)
    await updateChargingMode(CHARGE_STATE.PAUSED, false);
};

const decissionTurboCharge = async (currentChargingState: CHARGE_STATE) => {
  if (currentChargingState !== CHARGE_STATE.TURBO) {
    await updateChargingMode(CHARGE_STATE.TURBO, false);
  }
};
