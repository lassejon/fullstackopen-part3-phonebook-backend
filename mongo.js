const mongoose = require('mongoose')

const password = process.argv[2]

const url =
    `mongodb+srv://fullstackopen:${password}@cluster0.cinyi.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    console.log("phonebook:")
    Person
        .find({ important: true })
        .then(result => {
            result.forEach(p => {
                console.log(`${p.name} ${p.number}`)
            })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('person saved!', person)
        mongoose.connection.close()
    })
}