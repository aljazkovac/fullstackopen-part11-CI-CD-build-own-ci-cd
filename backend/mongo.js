/* eslint-disable no-undef */
const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://aljaz:${password}@cluster0.l8aozni.mongodb.net/phonebookApp?retryWrites=true&w=majority`
const entrySchema = new mongoose.Schema({
  name: String,
  number: Number,
})
const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      Entry.find({}).then(result => {
        result.forEach(entry => {
          console.log(entry)
        })
        mongoose.connection.close()
      })})
}
if (process.argv.length === 5) {
  let entry
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      entry = new Entry({
        name : process.argv.at(3),
        number: process.argv.at(4)
      })
      return entry.save()
    })
    .then(() => {
      console.log(`Added ${entry.name} with number ${entry.number} to the phonebook.`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
else if (process.argv.length > 5) {
  console.log('Too many arguments')
  console.log('Use like this: node mongo.js password \'name\' number')
}