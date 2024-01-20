// #region Setup
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const app = express()
// #endregion

// #region Middleware
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('data', (req) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'))
// #endregion

//#region Methods
app.get('/api/persons', (req, res) => {
  Entry.find({}).then(entries => {
    res.json(entries)
  })
})

app.get('/api/info', (req, res) => {
  const date = new Date()
  Entry.find({}).then(entries =>
    res.send(`<p>Phonebook has info for ${entries.length} people.<p>
            <p>${date.toString()}<p>`)
  )
})

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findById(req.params.id).then(entry => {
    if (entry) {
      res.json(entry)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

function generateRandomId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const entry = new Entry({
    id: generateRandomId(),
    name: body.name,
    number: body.number
  })
  entry.save().then(savedEntry => {
    res.json(savedEntry)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const updatedEntry = {
    name: req.body.name,
    number: req.body.number
  }
  Entry.findByIdAndUpdate(
    req.params.id,
    updatedEntry,
    { new: true, runValidators: true, context: 'query' })
    .then(updEntr => {
      res.json(updEntr)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entry.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// #region Error handling
const unknownEndPoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}
// Handles requests with unknown endpoint
// Must be loaded next to last
app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'Validation error') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

// This has to be the last loaded middleware
app.use(errorHandler)
// #endregion

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
//#endregion