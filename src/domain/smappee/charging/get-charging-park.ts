import fetch from "node-fetch";
import { logger } from "../../../utils/logger";
import { ChargingParkSessionType } from "./charging-park-session-type";
import { ServiceLocationType } from "./service-location-type";

export const getChargingParkLocationId = async (accessToken: string) => {
  try {
    const result = await fetch(
      process.env.SMAPPEE_BASEURL + "/servicelocation",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!result.ok) throw new Error("HTTP failed");

    const serviceLocation: ServiceLocationType = (await result.json()) as any;

    return serviceLocation.serviceLocations[0]?.serviceLocationId;
  } catch (error) {
    logger.error(`HTTP error! for /servicelocation ${error?.message}`);
  }
};

export const getCharingParkActiveSession = async (
  accessToken: string,
  from: number,
  to: number,
  CHARGING_PARK_SERVICE_LOCATION_ID: string
): Promise<ChargingParkSessionType> => {
  try {
    const result = await fetch(
      `${process.env.SMAPPEE_BASEURL}/chargingparks/${CHARGING_PARK_SERVICE_LOCATION_ID}/sessions?range=${from},${to}`,
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
      `HTTP error! for /chargingparks/${CHARGING_PARK_SERVICE_LOCATION_ID} ${error?.status}`
    );
  }
};
