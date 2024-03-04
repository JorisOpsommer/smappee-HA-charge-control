import {
  CHARGING_PARK_SESSION_STATUS,
  ChargingParkSessionType,
} from "../domain/smappee/charging/charging-park-session-type";
import {
  setCurrentChargingState,
  setIsLockedChargingState,
} from "../domain/smappee/charging/current-charging-state";
import { CHARGE_STATE } from "../models/smappee/charge-state-enum";
import { logger } from "../utils/logger";

//when no car is charging we want to put the session to active so we can badge properly.
export const forceActiveChargingToHandleNewSessions = async (
  session: ChargingParkSessionType
) => {
  if (!session) return;

  let isSessionActive: boolean = false;
  switch (session.status) {
    case CHARGING_PARK_SESSION_STATUS.CHARGING:
    case CHARGING_PARK_SESSION_STATUS.INITIAL:
    case CHARGING_PARK_SESSION_STATUS.STARTED:
    case CHARGING_PARK_SESSION_STATUS.SUSPENDED:
      isSessionActive = true;
      break;

    case CHARGING_PARK_SESSION_STATUS.STOPPED:
    case CHARGING_PARK_SESSION_STATUS.STOPPING:
      isSessionActive = false;
      break;
  }
  if (isSessionActive && session.to) {
    setIsLockedChargingState(false);
    logger.info(`isSessionActive ${isSessionActive}, so unlock charging state`);
  } else {
    //session inactive
    setCurrentChargingState(CHARGE_STATE.SLOW, false);
    setIsLockedChargingState(true);
    logger.info(
      `isSessionActive ${isSessionActive}, so lock charging state & set charging state to active so we can badge new session`
    );
  }
};
