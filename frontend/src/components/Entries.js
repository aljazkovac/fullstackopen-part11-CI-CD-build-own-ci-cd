import Person from "./Person"

const Entries = ( { entriesToShow, deleteEntry } ) => (
    <div>
      {entriesToShow.map(person => 
        <Person key={person.id} person={person} deletePerson={deleteEntry} />
      )} 
    </div>
)

export default Entries

