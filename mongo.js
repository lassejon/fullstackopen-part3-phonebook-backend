const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url =
    `mongodb+srv://fullstackopen:${password}@cluster0.cinyi.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
if (process.argv.length < 4) {
  console.log('phonebook:')
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
    // eslint-disable-next-line no-undef
    name: process.argv[3],
    // eslint-disable-next-line no-undef
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log('person saved!', person)
    mongoose.connection.close()
  })
}