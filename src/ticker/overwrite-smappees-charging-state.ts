import { currentChargingState } from "../domain/smappee/charging/current-charging-state";
import { updateChargingMode } from "../domain/smappee/charging/updateChargingMode";

export const overwriteSmappeesChargingState = async () => {
  await updateChargingMode(currentChargingState, false);
};
