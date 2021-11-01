import axios from 'axios'

import {OPEN_WEATHER_API_KEY, OPEN_WEATHER_LOCATION} from "@env"

export default function getTemperature(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        axios({
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${OPEN_WEATHER_LOCATION}&APPID=${OPEN_WEATHER_API_KEY}`,
            timeout: 10,
        })
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    });

}