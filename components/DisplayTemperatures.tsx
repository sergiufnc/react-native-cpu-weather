import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {View} from './Themed';

export default function DisplayTemperatures({cpu, temperature}: { cpu: number, temperature: number }) {
    return (
        <View>
            <Text>CPU Usage: {cpu}%</Text>
            <Text>Weather Temperature: {temperature}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

});
