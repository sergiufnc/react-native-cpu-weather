import {Data} from '../../types/state'
import * as types from '../actionTypes'

export const initialState = {
    data: []
};

export const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.ADD_DATA:
            return {...state, data: [...state.data, action.payload]};

        default:
            return state
    }
};

export type RootState = ReturnType<typeof rootReducer>