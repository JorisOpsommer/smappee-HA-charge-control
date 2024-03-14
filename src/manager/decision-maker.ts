import {
  SLOWCHARGE_PAUSED_TO_SLOW_WATT_THRESHOLD,
  SLOWCHARGE_SLOW_TO_PAUSED_WATT_THRESHOLD,
  SUNCHARGE_PAUSED_TO_SLOW_INVERTER_THRESHOLD,
  SUNCHARGE_PAUSED_TO_SLOW_WATT_THRESHOLD,
  SUNCHARGE_SLOW_TO_PAUSED_INVERTER_THRESHOLD,
  SUNCHARGE_SLOW_TO_PAUSED_WATT_THRESHOLD,
} from "../constants";
import { setCurrentChargingState } from "../domain/smappee/charging/current-charging-state";
import { HA_CHARGE_INSTRUCTION } from "../models/HA/ha-charge-instruction";
import { CHARGE_STATE } from "../models/smappee/charge-state-enum";
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
      decisionSlowCharge(sensorPowerConsumedInWatt, currentChargingState);
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

    case HA_CHARGE_INSTRUCTION.PAUSED:
      decissionPausedCharge(currentChargingState);
      break;
  }
};

const decisionSlowCharge = async (
  sensorPowerConsumedInWatt: number,
  currentChargingState: CHARGE_STATE
) => {
  if (currentChargingState === CHARGE_STATE.PAUSED) {
    if (sensorPowerConsumedInWatt < SLOWCHARGE_PAUSED_TO_SLOW_WATT_THRESHOLD) {
      await setCurrentChargingState(CHARGE_STATE.SLOW);
    }
  } else if (currentChargingState === CHARGE_STATE.SLOW) {
    if (sensorPowerConsumedInWatt > SLOWCHARGE_SLOW_TO_PAUSED_WATT_THRESHOLD) {
      await setCurrentChargingState(CHARGE_STATE.PAUSED);
    }
  }

  if (currentChargingState === CHARGE_STATE.TURBO)
    await setCurrentChargingState(CHARGE_STATE.PAUSED, false);
};

const decissionSunCharge = async (
  sensorPowerConsumedInWatt: number,
  sensorInverterSolarInWatt: number,
  currentChargingState: CHARGE_STATE
) => {
  if (currentChargingState === CHARGE_STATE.PAUSED) {
    if (
      sensorPowerConsumedInWatt < SUNCHARGE_PAUSED_TO_SLOW_WATT_THRESHOLD &&
      sensorInverterSolarInWatt > SUNCHARGE_PAUSED_TO_SLOW_INVERTER_THRESHOLD
    ) {
      await setCurrentChargingState(CHARGE_STATE.SLOW);
    }
  }

  if (currentChargingState === CHARGE_STATE.SLOW) {
    if (
      sensorPowerConsumedInWatt > SUNCHARGE_SLOW_TO_PAUSED_WATT_THRESHOLD ||
      sensorInverterSolarInWatt < SUNCHARGE_SLOW_TO_PAUSED_INVERTER_THRESHOLD
    ) {
      await setCurrentChargingState(CHARGE_STATE.PAUSED);
    }
  }

  if (currentChargingState === CHARGE_STATE.TURBO)
    await setCurrentChargingState(CHARGE_STATE.PAUSED, false);
};

const decissionTurboCharge = async (currentChargingState: CHARGE_STATE) => {
  if (currentChargingState !== CHARGE_STATE.TURBO) {
    await setCurrentChargingState(CHARGE_STATE.TURBO, false);
  }
};

const decissionPausedCharge = async (currentChargingState: CHARGE_STATE) => {
  if (currentChargingState !== CHARGE_STATE.PAUSED)
    await setCurrentChargingState(CHARGE_STATE.PAUSED, false);
};
