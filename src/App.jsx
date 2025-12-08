import TodoList from'./TodoList.jsx'
import TodoForm from'./TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [NewTodo, setNewTodo] = useState("example text")
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm/>
      <p> {NewTodo} </p>
      <TodoList/>
    </div>
  )
}
export default App