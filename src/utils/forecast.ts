import request from 'request'

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=4685b4c632bd818c537aff305e925f73&query=${latitude},${longitude}`

    request({ url, json: true }, (error, { body = undefined } = {}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location!', undefined)
        } else {
            callback(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degress out. It feels like ${body.current.feelslike} degress out. The humidity is ${body.current.humidity}%.`)
        }
    })
}

export default forecast