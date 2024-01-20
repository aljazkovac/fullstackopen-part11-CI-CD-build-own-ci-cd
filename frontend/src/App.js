import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Entries from './components/Entries'
import personService from './services/Persons'
import Notification from './components/Notification'
import './index.css'

const baseUrl = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    console.log('effect')
    axios
      .get(baseUrl)
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')


  const findMaxId = () => {
    let maxId = 0
    persons.forEach(person => { 
      if (person.id > maxId) {
        maxId = person.id
      }
    return maxId
    });
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = 
    {
      name: newName,
      number: newNumber,
      id: findMaxId()
    }
    if (persons.some(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace 
            the old number with a new one?`)) {
              console.log("Updating the number");
              const person = persons.find(p => p.name === newName)
              updatePerson(person)
            }
      setNewName('')
      setNewNumber('')
      return
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        // The following lines ensure that the name and number 
        // do not remain written in the input box after submitting 
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${personObject.name}.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response);
        setError(true)
        setMessage("Error")
      })
  }
  const updatePerson = (person) => {
    const changedPerson = {...person, number: newNumber}
    console.log("Changed person = ", changedPerson);

    personService
      .update(changedPerson.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== changedPerson.id ? p : returnedPerson))
        setMessage(`Updated the number for ${changedPerson.name}.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setError(true)
        console.log(error.response.data.error);
        setMessage("Error")
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        //setPersons(persons.filter(p => p.id !== changedPerson.id))
      })
  }

  const deleteEntry = id => {
    const person = persons.find(n => n.id === id)
    const idx = persons.indexOf(person)
    console.log("Deleted person idx = ", idx);
    let personsCopy = [...persons]
    // console.log("Persons copy before delete = ", personsCopy);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(id)
      .then(() => {
        personsCopy.splice(idx, 1)
        setMessage(`Deleted ${person.name}.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        // console.log("Persons copy after delete = ", personsCopy);
        setPersons(personsCopy)
      }
      )
      .catch(() => {
        setError(true)
        setMessage(`${person.name} was already deleted from the server.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleNewName = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNewNumber = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setShowAll(false)
    // console.log("Target value = ", event.target.value)
    setNewFilter(event.target.value)
    if (event.target.value === '') {
      setShowAll(true)
    }
  }
  const entriesToShow = showAll 
      ? persons 
      : persons.filter(person => 
          person.name.substring(0, filter.length).toLowerCase() 
            === filter.toLowerCase())
  return (
    <div>
      <h1>The Phonebook</h1>
      <p>Here you can add entries to the phonebook, and filter
        them by name.
      </p>
      <h2>Filter</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add an entry</h2>
      <PersonForm addPerson={addPerson} newName={newName}
                  handleNewName={handleNewName} newNumber={newNumber}
                  handleNewNumber={handleNewNumber} />
      <Notification message={message} error={error} />
      <h2>Filtered results</h2>
      <Entries entriesToShow={entriesToShow} deleteEntry={deleteEntry} />
    </div>
  )
}

export default App
