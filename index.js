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

let persons =
[
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieckert",
        "number": "39-23-6423122"
    }
]

// GET
app.get('/', (request, response) => {
    response.send('root')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    const message =
        `Phonebook has info for ${persons.length} people \r\n ${date}`;

    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

// DELETE
app.delete('/api/persons/:id',
    (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// POST
const generateId = (max) => {
    const ids = new Set(persons.map(p => p.id))
    let randomId;
    do {
        randomId = Math.floor(Math.random() * max);
    } while(ids.has(randomId))

    return randomId
}


app.post('/api/persons',
    (request, response) => {
    const body = request.body;

    if(!body.name || !body.number) {
        response.status(400).json({
            error: 'name and/or number missing'
        })
        return
    }

    const samePerson = persons.find(p => p.name === body.name)
    if (samePerson) {
        response.status(400).json({ error: 'name must be unique' })
        return
    }

    const person =
    {
        id: generateId(persons.length*200),
        name: body.name,
        "number": body.number
    }
    
    persons = persons.concat(person)
    response.status(204).json(person).end()
})

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})