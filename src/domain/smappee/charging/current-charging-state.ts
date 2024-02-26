import dayjs from "dayjs";
import { CHARGE_STATE } from "../../../models/smappee/charge-state-enum";
import { logger } from "../../../utils/logger";

const MIN_UPDATE_INTERVAL_IN_MINUTES = 10;

export let currentChargingState: CHARGE_STATE = CHARGE_STATE.PAUSED;
export let lastUpdatedChargingState: Date = dayjs().subtract(1, "day").toDate();

export const setCurrentChargingState = (
  state: CHARGE_STATE,
  isNewLastUpdated: boolean = true
) => {
  currentChargingState = state;
  if (isNewLastUpdated) lastUpdatedChargingState = new Date();
};

export const canUpdateChargingState = (): boolean => {
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
