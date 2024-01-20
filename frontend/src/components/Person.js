const Person = ({ person, deletePerson }) => (
    <p>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></p>
)

export default Person

