const entriesRouter = require('express').Router()
const Entry = require('../models/entry')

//#region Methods
entriesRouter.get('/', (req, res) => {
  Entry.find({}).then(entries => {
    res.json(entries)
  })
})

entriesRouter.get('/:id', (req, res, next) => {
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

entriesRouter.post('/', (req, res, next) => {
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

entriesRouter.put('/:id', (req, res, next) => {
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

entriesRouter.delete('/:id', (req, res, next) => {
  Entry.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = entriesRouter