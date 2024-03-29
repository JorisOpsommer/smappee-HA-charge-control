import fetch from "node-fetch";
import { CHARGE_STATE } from "../../../models/smappee/charge-state-enum";
import { logger } from "../../../utils/logger";
import { getAccessToken } from "../auth/authManager";

const PUT_CHARGING_MODE_URL = `${process.env.SMAPPEE_BASEURL}/chargingstations/${process.env.SMAPPEE_SERIALID_MOBILE_APP}/connectors/1/mode`;

export const updateChargingMode = async (chargeSetting: CHARGE_STATE) => {
  const tokenSmappee = await getAccessToken();
  const body = getApiSettingsForCharging(chargeSetting);

  try {
    return await fetch(PUT_CHARGING_MODE_URL, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenSmappee}`,
      },
    }).then((result) => {
      if (result.ok) {
        return true;
      } else {
        logger.error(
          `HTTP error! ${PUT_CHARGING_MODE_URL}, status: ${result.status}`
        );
        throw new Error(`HTTP error! status: ${result.status}`);
      }
    });
  } catch (error) {
    logger.error(
      `HTTP error! ${PUT_CHARGING_MODE_URL}, status: ${error.status}`
    );
    return;
  }
};

const getApiSettingsForCharging = (chargeSetting: CHARGE_STATE) => {
  switch (chargeSetting) {
    case CHARGE_STATE.PAUSED:
      return { mode: "PAUSED" };
    case CHARGE_STATE.SLOW:
      return {
        mode: "NORMAL",
        limit: {
          unit: "AMPERE",
          value: 6,
        },
      };
    case CHARGE_STATE.TURBO:
      return {
        mode: "NORMAL",
        limit: {
          unit: "PERCENTAGE",
          value: 100,
        },
      };
  }
};
