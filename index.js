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
      .catch(error => {
          console.log(error)
          response.status(500).end()
      })
})

app.get('/api/info', (request, response) => {
    const date = new Date()

    Person.count({}, function( err, count){
        response.send(`Phonebook has info for ${count} people \r\n ${date}`);
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
          if (person) {
              response.json(person)
          } else {
              response.status(404).end()
          }
      })
      .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id',
    (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
          response.status(204).end()
      })
      .catch(error => next(error))
})

// POST
app.post('/api/persons',
  (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

      if (Person.exists(person)) {
          console.log("exists")
      }

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
})

// PUT
app.put('/api/persons/:id',
  (request, response, next) => {
    const { name, number } = request.body
      console.log(request.params.id, name, number)

    Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedPerson => {
          response.json(updatedPerson)
      })
      .catch(error => {
          next(error)
      })
})

// ERROR
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.number === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})