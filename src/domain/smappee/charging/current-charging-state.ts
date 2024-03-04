import dayjs from "dayjs";
import { CHARGE_STATE } from "../../../models/smappee/charge-state-enum";
import { logger } from "../../../utils/logger";

const MIN_UPDATE_INTERVAL_IN_MINUTES = 10;

export let currentChargingState: CHARGE_STATE = CHARGE_STATE.PAUSED;
let lastUpdatedChargingState: Date = dayjs().subtract(1, "day").toDate();
let isLockedChargingState: boolean = false;

export const setCurrentChargingState = (
  state: CHARGE_STATE,
  visibleStateUpdate: boolean = true
) => {
  if (canUpdateChargingState(visibleStateUpdate)) {
    currentChargingState = state;
    if (visibleStateUpdate) lastUpdatedChargingState = new Date();
  }
};

export const setIsLockedChargingState = (state: boolean) => {
  isLockedChargingState = state;
};

export const getInfoCurrentChargingState = (): {
  currentChargingState: CHARGE_STATE;
  lastUpdatedChargingState: Date;
  isLockedChargingState: boolean;
} => {
  return {
    currentChargingState,
    lastUpdatedChargingState,
    isLockedChargingState,
  };
};

const canUpdateChargingState = (visibleStateUpdate): boolean => {
  logger.info(
    `canUpdateChargingState, visibleStateUpdate: ${visibleStateUpdate}, isLockedChargingState: ${isLockedChargingState}`
  );
  if (isLockedChargingState) return false;
  if (!visibleStateUpdate) return true; //it's not a visible state so don't check if state is older than x minutes.

  const lastUpdate = dayjs(lastUpdatedChargingState);

  if (dayjs().diff(lastUpdate, "minute") >= MIN_UPDATE_INTERVAL_IN_MINUTES)
    return true;
  logger.info(
    `canUpdateChargingState is false because diff in min = ${dayjs().diff(
      lastUpdate,
      "minute"
    )} < ${MIN_UPDATE_INTERVAL_IN_MINUTES}`
  );
  return false;
};
