import * as AppActions from "../actions/AppActions"
import {Dispatch} from "redux";
import getCpu from "../../utils/getCpu";
import getTemperature from "../../utils/getTemperature";

export function addData() {
  return async (dispatch: Dispatch) => {
    let cpu, temperature;

    try {
      cpu = await getCpu()
    } catch (e) {
      // I would add the rollbar, or another logging system here instead
      console.error('Error at getting the CPU usage', e)
    }

    try {
      temperature = await getTemperature()
    } catch (e) {
      // I would add the rollbar, or another logging system here instead
      console.error('Error at getting the weather temperature usage', e)
    }

    if (cpu && temperature) {
      dispatch(AppActions.addData(cpu, temperature))
    }
  }
}