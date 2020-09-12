import request from 'supertest'
import { ImportMock } from 'ts-mock-imports'
import * as geocodeModule from './utils/geocode'
import * as forecastModule from './utils/forecast'
import app from './app'

let geocodeStub, forecastStub

beforeAll(async () => {
    // Initialize HBS pages/engine
    await request(app).get('/')

    // Mock external API
    geocodeStub = ImportMock.mockFunction(geocodeModule, 'default', {
        error: 'Unable to connect to location services!'
    })
    forecastStub = ImportMock.mockFunction(forecastModule, 'default', {
        error: 'Unable to connect to weather service!'
    })
})

test('GET / should return weather page', async () => {
    const response = await request(app)
        .get('/')
        .expect(200)

    expect(response.text)
        .toMatch('<h1>Weather</h1>')
})

test('GET /about should return about page', async () => {
    const response = await request(app)
        .get('/about')
        .expect(200)

    expect(response.text)
        .toMatch('<h1>About</h1>')
})

test('GET /help should return help page', async () => {
    const response = await request(app)
        .get('/help')
        .expect(200)

    expect(response.text)
        .toMatch('<h1>Help</h1>')
})

test('GET /help/nonexistentendpoints should return 404 help page', async () => {
    const response = await request(app)
        .get('/help/nonexistentendpoints')
        .expect(404)

    expect(response.text)
        .toMatch('<p>Help article not found</p>')
})

test('GET /nonexistentendpoints should return 404 page', async () => {
    const response = await request(app)
        .get('/nonexistentendpoints')
        .expect(404)

    expect(response.text)
        .toMatch('<p>Page not found</p>')
})

test('GET /weather?location=Can%20Tho%20VN should return a forecast for Can Tho, Vietnam', async () => {
    const location = 'Can Tho VN'

    if (geocodeStub) {
        geocodeStub.returns({
            data: {
                latitude: 10.03333, longidude: 105.78333,
                location: 'Can Tho, Vietnam'
            }
        })
    }

    if (forecastStub) {
        forecastStub.returns({
            data: '... The humidity is ...'
        })
    }

    const response = await request(app)
        .get(`/weather?address=${location}`)
        .expect('Content-Type', /json/)
        .expect(200)

    expect(response.body.location)
        .toEqual('Can Tho, Vietnam')
    expect(response.body.forecast)
        .toMatch('The humidity is')
})

test('GET /weather?location= should return an error', async () => {
    const location = ''
    const response = await request(app)
        .get(`/weather?address=${location}`)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body.error)
        .toEqual('You must provide an address.')
})

test('GET /weather?location=whereami should return an error', async () => {
    const location = 'whereami'
    if (geocodeStub) {
        geocodeStub.returns({
            error: 'Unable to find location. Try another search.'
        })
    }
    const response = await request(app)
        .get(`/weather?address=${location}`)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body.error)
        .toMatch('Unable to find location.')
})