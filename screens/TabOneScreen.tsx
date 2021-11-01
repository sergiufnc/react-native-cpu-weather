import * as React from 'react';
import {useState} from 'react';
import {NativeModules, StyleSheet} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from '../types';

import BackgroundFetch from "react-native-background-fetch";

const {CpuModule} = NativeModules;

type Data = {
    usage: number,
    timestamp: string
}

const BACKGROUND_FETCH_TASK = 'com.reactnativecpuweather.fetch';


export default function TabOneScreen({navigation}: RootTabScreenProps<'TabOne'>) {
    const [data, setData] = useState([])

    const initFetch = async () => {
        console.log('initFetch...')

        // Step 1:  Configure BackgroundFetch as usual.
        let status = await BackgroundFetch.configure({
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            enableHeadless: true,
            requiresCharging: false,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
            requiresDeviceIdle: false,
            requiresBatteryNotLow: false,
            requiresStorageNotLow: false
        }, async (taskId) => {  // <-- Event callback
            // This is the fetch-event callback.
            console.log("[BackgroundFetch] taskId: ", taskId);

            await getUsage('test')

            // Use a switch statement to route task-handling.
            switch (taskId) {
                case BACKGROUND_FETCH_TASK:
                    console.log("Received custom task");
                    break;
                default:
                    console.log("Default fetch task");
            }
            // Finish, providing received taskId.
            BackgroundFetch.finish(taskId);
        }, async (taskId) => {  // <-- Task timeout callback
            console.log('initFetch:onTimeout...')

            // This task has exceeded its allowed running-time.
            // You must stop what you're doing and immediately .finish(taskId)
            BackgroundFetch.finish(taskId);
        });

        console.log('[BackgroundFetch] configure status: ', status);

        const scheduled = await BackgroundFetch.scheduleTask({
            taskId: BACKGROUND_FETCH_TASK,
            delay: 5000,  // <-- milliseconds,
            periodic: true
        });
    }

    React.useEffect(() => {
        initFetch()

        /*initBackgroundFetch()

        BackgroundFetch.scheduleTask({
            taskId: 'com.reactnativecpuweather.fetch',
            delay: 1 * 15 * 1000  //  In one hour (milliseconds)
        });*/
    })

    /*const initBackgroundFetch = async () => {
        // BackgroundFetch event handler.
        const onEvent = async (taskId: any) => {
            console.log('[BackgroundFetch] task: ', taskId);
            // Do your background work...

            try {
                await getUsage(taskId);
            } catch (e) {
                console.log(e)
            }

            // IMPORTANT:  You must signal to the OS that your task is complete.
            BackgroundFetch.finish(taskId);
        }

        // Timeout callback is executed when your Task has exceeded its allowed running-time.
        // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
        const onTimeout = async (taskId: any) => {
            console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
            BackgroundFetch.finish(taskId);
        }

        // Initialize BackgroundFetch only once when component mounts.
        let status = await BackgroundFetch.configure({minimumFetchInterval: 1}, onEvent, onTimeout);
        console.log('[BackgroundFetch] configure status: ', status);
    }*/

    // Add a BackgroundFetch event to <FlatList>
    const getUsage = (taskId: any) => {
        // Simulate a possibly long-running asynchronous task with a Promise.
        return new Promise((resolve, reject) => {
            CpuModule.getUsage((usage: number) => {
                // @ts-ignore
                setData((prev: any) => [
                    ...data,
                    {usage, timestamp: (new Date()).toString()}
                ])

                resolve(null);
            })
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{JSON.stringify(data)}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <EditScreenInfo path="/screens/TabOneScreen.tsx"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
