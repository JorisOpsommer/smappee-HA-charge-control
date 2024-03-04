import { logger } from "../../../utils/logger";
import { ChargingParkSessionType } from "./charging-park-session-type";

export const getChargingParkActiveSession = async (
  accessToken: string,
  from: number,
  to: number,
  chargingParkLocationId: number
): Promise<ChargingParkSessionType> => {
  try {
    const result = await fetch(
      `${process.env.SMAPPEE_BASEURL}/chargingparks/${chargingParkLocationId}/sessions?range=${from},${to}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const chargingParkSessions: ChargingParkSessionType[] =
      (await result.json()) as any;
    const lastChargingParkSession = chargingParkSessions?.[0];
    return lastChargingParkSession;
  } catch (error) {
    logger.error(
      `HTTP error! for /chargingparks/${chargingParkLocationId} ${error?.status}`
    );
  }
};
