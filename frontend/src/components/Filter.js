const Filter = ( {filter, handleFilter} ) => (
    <div>
    Filter by name: <input 
        value={filter}
        onChange={handleFilter}
            />
    </div>
      )

export default Filter

