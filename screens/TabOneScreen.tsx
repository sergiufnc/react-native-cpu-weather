import * as React from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux'
import {View} from '../components/Themed';
import {RootTabScreenProps} from '../types';

import BackgroundFetch from "react-native-background-fetch";
import {RootState} from "../redux/reducers";
import {addData} from "../redux/middlewares/DataMiddleware";
import {Data} from "../types/state";
import DisplayTemperatures from "../components/DisplayTemperatures";

const BACKGROUND_FETCH_TASK = 'com.reactnativecpuweather.fetch';

export default function TabOneScreen({navigation}: RootTabScreenProps<'TabOne'>) {
    const data = useSelector((root: any) => root.rootReducer.data)

    const dispatch = useDispatch()

    const initFetch = async () => {
        await BackgroundFetch.configure({
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            enableHeadless: true,
            requiresCharging: false,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
            requiresDeviceIdle: false,
            requiresBatteryNotLow: false,
            requiresStorageNotLow: false
        }, async (taskId) => {

            // Handle the tasks
            switch (taskId) {
                case BACKGROUND_FETCH_TASK:
                    dispatch(addData())
                    break;
                default:

            }

            BackgroundFetch.finish(taskId);
        }, async (taskId) => {
            // This task has exceeded its allowed running-time.
            // You must stop what you're doing and immediately .finish(taskId)
            BackgroundFetch.finish(taskId);
        });

        await BackgroundFetch.scheduleTask({
            taskId: BACKGROUND_FETCH_TASK,
            delay: 5000,  // <-- milliseconds,
            periodic: true
        });
    };

    React.useEffect(() => {
        initFetch();
    });

    return (
        <View style={styles.container}>
            {(data || []).map((oneData: Data, index: number) => (
                <DisplayTemperatures key={index} {...oneData} />
            ))}

            <Pressable style={styles.button} onPress={() => {
                dispatch(addData())
            }}>
                <Text style={styles.buttonText}>Add data manually</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#fff',
        padding: 20
    },
    buttonText: {
        fontWeight: 'bold'
    }
});
