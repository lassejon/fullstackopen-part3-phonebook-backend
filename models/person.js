const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    validate: {
      validator: async function (v) {
        const count = await PersonModel.countDocuments({name: v})
        console.log("why")
        return !count
      },
      message: `Person already exists`
    }
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        const reg = /^[0-9]{8,}$|^[0-9]{2,3}(-)[0-9]{5,}$/

        return reg.test(v)
      },
      message: 'Does not match requirements: (12345678) or more characters, (000-12345) or (00-12345)'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const PersonModel = mongoose.model('Person', personSchema)

module.exports = PersonModel