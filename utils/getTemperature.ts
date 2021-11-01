import axios from 'axios'

import {OPEN_WEATHER_API_KEY, OPEN_WEATHER_LOCATION} from "react-native-dotenv"

export const cToF = (celsius: number): number => {
    return celsius * 9 / 5 + 32
};

export const fToC = (fahrenheit: number): number => {
    return (fahrenheit - 32) * 5 / 9
};

export default function getTemperature(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        axios({
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${OPEN_WEATHER_LOCATION}&APPID=${OPEN_WEATHER_API_KEY}`,
            timeout: 10,
        })
            .then(response => {
                const {main} = response.data;
                const {temp} = main;

                resolve(fToC(temp));
            })
            .catch(error => {
                reject(error)
            })
    });
}