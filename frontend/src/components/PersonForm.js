const PersonForm = ( {addPerson, newName, handleNewName,
                     newNumber, handleNewNumber} ) => (
      <form onSubmit={addPerson}>
            Name: <input 
                value={newName}
                onChange={handleNewName} 
                    />
            Number: <input 
                value={newNumber}
                onChange={handleNewNumber}
                    />
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    )

export default PersonForm

