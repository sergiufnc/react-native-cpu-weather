import axios from 'axios'

import {OPEN_WEATHER_API_KEY, OPEN_WEATHER_LOCATION} from "react-native-dotenv"

export default function getTemperature(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        axios({
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${OPEN_WEATHER_LOCATION}&APPID=${OPEN_WEATHER_API_KEY}&units=metric`,
            //timeout: 10,
        })
            .then(response => {
                const {main} = response.data;
                const {temp} = main;

                resolve(temp);
            })
            .catch(error => {
                reject(error)
            })
    });
}