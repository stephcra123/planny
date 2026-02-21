 import { useState, useEffect } from 'react'
 import styled from 'styled-components'

 const StyledForm = styled.form`
  padding: 0.5rem;
`
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`
const StyledButton = styled.button`
  padding: 0.4rem 0.75rem;
`
const StyledLabel = styled.label`
  font-weight: 600;
`
const StyledSelect = styled.select`
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #c4c9d4;
  font-size: 0.95rem;
`
function TodosViewForm({ 
    sortDirection,
    setSortDirection,
    sortField, 
    setSortField, 
    queryString, 
    setQueryString 
}) {
    const [localQueryString, setLocalQueryString] = useState(queryString)
    useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
     }, [localQueryString, setQueryString]);
  
  const preventRefresh = (e) => {
    e.preventDefault();
  };
  return (
<form onSubmit={preventRefresh}>
  <div>
    <label htmlFor="search">Search todos</label>
        <input
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button
            type="button"
            onClick={() => setLocalQueryString("")}
                >
            Clear
        </button>
    <label htmlFor="sortField">Sort by</label>
    <select 
        id="sortField"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
    >
      <option value="Title">Title</option>
      <option value="createdTime">Time added</option>
    </select>

    <label htmlFor="sortDirection">Direction</label>
    <select 
        id="sortDirection"
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value)}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</form>
    )
}
export default TodosViewForm