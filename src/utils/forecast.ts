import got from 'got'
import ExternalJsonData from '../external-json-data'

const forecast = async (latitude, longitude): Promise<ExternalJsonData> => {
    const url = `http://api.weatherstack.com/current?access_key=4685b4c632bd818c537aff305e925f73&query=${latitude},${longitude}`

    try {
        const { body } = await got(url, { responseType: 'json' })

        if ((body as any).error == 0) {
            return new ExternalJsonData('Unable to find location!', undefined)
        }

        let current: any = (body as any).current
        return new ExternalJsonData(undefined,
            `${current.weather_descriptions[0]}. It is currently ${current.temperature} degress out. It feels like ${current.feelslike} degress out. The humidity is ${current.humidity}%.`)
    } catch(error) {
        return new ExternalJsonData('Unable to connect to weather service!', undefined)
    }
}

export default forecast