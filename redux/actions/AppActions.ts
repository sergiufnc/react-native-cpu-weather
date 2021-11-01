import * as types from "../actionTypes"

export function addData(cpu: number, temperature: number) {
    return {type: types.ADD_DATA, payload: {cpu, temperature}}
}