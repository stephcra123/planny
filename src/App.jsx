import TodoList from'./TodoList.jsx'
import TodoForm from'./TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  function addTodo(title){
        const newTodo = {id: Date.now(), title: title}
        setTodoList([...todoList, newTodo])
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList}/>
    </div>
  )
}
export default App