const HA_URL_ENTITY_STATES = `${process.env.HA_BASEURL}/states`;
import { logger } from "../../../utils/logger";
import { HAEntityState } from "./entity-state-type";

export const getEntityState = async (
  entity: string
): Promise<HAEntityState> => {
  try {
    const result = await fetch(`${HA_URL_ENTITY_STATES}/${entity}`, {
      headers: {
        Authorization: `Bearer ${process.env.HA_TOKEN}`,
      },
    });

    if (!result.ok) {
      logger.error(
        `HTTP error! ${HA_URL_ENTITY_STATES}/${entity}, status: ${result.status}`
      );
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    return result.json();
  } catch (error) {
    logger.error(
      `HTTP error! ${HA_URL_ENTITY_STATES}/${entity}, status: ${error.status}`
    );
    return;
  }
};
