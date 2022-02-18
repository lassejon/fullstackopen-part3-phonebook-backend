require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const {request, response} = require("express");
const cors = require('cors')
const morgan = require('morgan')

const app = express()

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

// GET
app.get('/', (request, response) => {
    response.send('root')
})

app.get('/api/persons', (request, response) => {
    Person
      .find({})
      .then(people => {
          response.json(people)
      })
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    const message =
        `Phonebook has info for ${Person.length} people \r\n ${date}`;

    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// DELETE
app.delete('/api/persons/:id',
    (request, response) => {
    Person.findByIdAndRemove(request.params.id, (error, person) => {
        if (!person){
            console.log("Could not find person")
        }
        else{
            console.log("Deleted User : ", person);
        }
    })
    response.status(204).end()
})

// POST
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name and/or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    console.log("wtf")
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})