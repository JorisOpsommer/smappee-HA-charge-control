import { currentChargeInstruction } from "../domain/HA/charging-instruction/current-charging-instruction";
import { getEntityState } from "../domain/HA/entity-states/get-entity-state";
import { currentChargingState } from "../domain/smappee/charging/current-charging-state";
import { decisionMaker } from "../manager/decision-maker";

const MOVING_AVERAGE_LENGTH = 10;

const movingAverageSensorPowerConsumed: number[] = [];
const movingAverageSensorInverterSolar: number[] = [];

export const ticker = async () => {
  const sensorPowerConsumed = await getEntityState(
    process.env.HA_SENSOR_POWER_CONSUMPTION
  );
  const sensorInverterSolar = await getEntityState(
    process.env.HA_SENSOR_INVERTER_SOLAR
  );

  if (!sensorPowerConsumed?.attributes?.unit_of_measurement) return;

  if (!sensorInverterSolar?.attributes?.unit_of_measurement) return;

  let sensorPowerConsumedInWatt: number = Number(sensorPowerConsumed.state);
  if (sensorPowerConsumed.attributes.unit_of_measurement.toLowerCase() === "kw")
    sensorPowerConsumedInWatt *= 1000;

  let sensorInverterSolarInWatt: number = Number(sensorInverterSolar.state);
  if (sensorInverterSolar.attributes.unit_of_measurement.toLowerCase() === "kw")
    sensorInverterSolarInWatt *= 1000;

  if (movingAverageSensorPowerConsumed.length >= MOVING_AVERAGE_LENGTH) {
    movingAverageSensorPowerConsumed.shift();
  }

  //if sensorPowerConsumedInWatt is 0 then it means we are injecting to the net, thus the actual value is sensorPowerConsumedInWatt - sensorInverterSolar
  if (sensorPowerConsumedInWatt === 0)
    sensorPowerConsumedInWatt -= sensorInverterSolarInWatt;

  movingAverageSensorPowerConsumed.push(sensorPowerConsumedInWatt);

  if (movingAverageSensorInverterSolar.length >= MOVING_AVERAGE_LENGTH) {
    movingAverageSensorInverterSolar.shift();
  }
  movingAverageSensorInverterSolar.push(sensorInverterSolarInWatt);

  const totalMovingAverageSensorPowerConsumed =
    movingAverageSensorPowerConsumed.reduce((s, t) => (t += s), 0);
  const totalMovingAverageSensorInverterSolar =
    movingAverageSensorInverterSolar.reduce((s, t) => (t += s), 0);

  await decisionMaker(
    totalMovingAverageSensorPowerConsumed /
      movingAverageSensorPowerConsumed.length,
    totalMovingAverageSensorInverterSolar /
      movingAverageSensorInverterSolar.length,
    currentChargingState,
    currentChargeInstruction
  );
};
