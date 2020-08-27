const request = require('supertest')

// Supertest seems to not work with HBS pages for some reasons.
//      A workaround is to manually start the web server
//      and tell supertest to do the testing on that server
// const app = require('./app.js')
const app = 'localhost:3000'

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

test('GET /weather?location=Can%20Tho%20VN should return a forecast for Can Tho, Viet Nam', async () => {
    const location = 'Can Tho VN'
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
    const response = await request(app)
        .get(`/weather?address=${location}`)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body.error)
        .toMatch('Unable to find location.')
})