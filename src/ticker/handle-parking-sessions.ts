import dayjs from "dayjs";
import { getAccessToken } from "../domain/smappee/auth/authManager";
import { getChargingParkActiveSession } from "../domain/smappee/charging/get-charging-park-active-session";
import { getChargingParkLocationId } from "../domain/smappee/charging/get-charging-park-location-id";
import { forceActiveChargingToHandleNewSessions } from "../manager/force-active-charging-to-handle-new-sessions";

export const handleParkingSessions = async () => {
  const lastWeek = dayjs().subtract(1, "week").valueOf();
  const tomorrow = dayjs().add(1, "day").valueOf();

  const accessTokenSmappee = await getAccessToken();
  const chargingParkLocationId = await getChargingParkLocationId(
    accessTokenSmappee
  );
  const session = await getChargingParkActiveSession(
    accessTokenSmappee,
    lastWeek,
    tomorrow,
    chargingParkLocationId
  );

  await forceActiveChargingToHandleNewSessions(session);
};
