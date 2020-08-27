const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

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

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.status(400).send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longidude, location } = {}) => {
        if (error) {
            return res.status(400).send({ error })
        }
    
        forecast (latitude, longidude, (error, forecastData) => {
            if (error) {
                return res.status(400).send({ error })
            }
            
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
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

module.exports = app