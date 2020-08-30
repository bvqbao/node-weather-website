import request from 'request'

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYnZxYmFvIiwiYSI6ImNrZHE1dHA5eDExaWwyc3BheGp6aWhtZmUifQ.8FHMC96JUgUryW9ErTvpCA`

    request({ url, json: true }, (error, { body = undefined } = {}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length == 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longidude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

export default geocode