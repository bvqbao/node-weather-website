import path from 'path'
import express from 'express'
import hbs from 'hbs'
import ExternalJsonData from './external-json-data'
import geocode from './utils/geocode'
import forecast from './utils/forecast'

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Bao Bui'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Bao Bui'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Bao Bui',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather', async (req, res) => {
    if (!req.query.address) {
        return res.status(400).send({
            error: 'You must provide an address.'
        })
    }

    const geocodeData: ExternalJsonData = await geocode(req.query.address)
    if (geocodeData.error) {
        return res.status(400).send({
            error: geocodeData.error
        })
    }

    const forecastData: ExternalJsonData = await forecast(geocodeData.data.latitude, geocodeData.data.longidude)
    if (forecastData.error) {
        return res.status(400).send({
            error: forecastData
        })
    }

    return res.send({
        forecast: forecastData.data,
        location: geocodeData.data.location,
        address: req.query.address
    })
})

app.get('/help/*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Bao Bui',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Bao Bui',
        errorMessage: 'Page not found'
    })
})

export default app