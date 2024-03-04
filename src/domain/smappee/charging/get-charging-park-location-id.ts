import fetch from "node-fetch";
import { logger } from "../../../utils/logger";
import { ChargingParkSessionType } from "./charging-park-session-type";
import { ServiceLocationType } from "./service-location-type";

let SERVICE_LOCATION_ID: number;

export const getChargingParkLocationId = async (accessToken: string) => {
  if (SERVICE_LOCATION_ID) return SERVICE_LOCATION_ID;

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
