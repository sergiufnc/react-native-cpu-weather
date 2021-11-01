import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunkMiddleware from "redux-thunk"
import {persistReducer, persistStore} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Reducer from '../reducers'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['temporary'],
};

const combinedReducer = combineReducers({
    rootReducer: Reducer.rootReducer
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));

    let persistor = persistStore(store);

    return {store, persistor}
}
