import * as types from "../actionTypes"

export function addData(cpu: number, weather: number) {
    return {type: types.ADD_DATA, payload: {cpu, weather}}
}