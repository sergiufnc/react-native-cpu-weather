import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const storeFunc = store()

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
      return (
            <Provider store={storeFunc.store}>
                <SafeAreaProvider>
                    <Navigation colorScheme={colorScheme}/>
                    <StatusBar/>
                </SafeAreaProvider>
            </Provider>
        );
    }
}
