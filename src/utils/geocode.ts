import got from 'got'
import ExternalJsonData from '../external-json-data'

const geocode = async (address): Promise<ExternalJsonData> => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYnZxYmFvIiwiYSI6ImNrZHE1dHA5eDExaWwyc3BheGp6aWhtZmUifQ.8FHMC96JUgUryW9ErTvpCA`

    try {
        const { body }: { body: any } = await got(url, { responseType: 'json' })

        if (body.features.length == 0) {
            return new ExternalJsonData('Unable to find location. Try another search.', undefined)
        }

        return new ExternalJsonData(undefined, {
            latitude: body.features[0].center[1],
            longidude: body.features[0].center[0],
            location: body.features[0].place_name
        })
    } catch(error) {
        return new ExternalJsonData('Unable to connect to location services!', undefined)
    }
}

export default geocode