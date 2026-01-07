import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  function addTodo(title){
        const newTodo = {id: Date.now(), title: title, isCompleted: false}
        setTodoList([...todoList, newTodo])
  }
  function completeTodo(todoId) {
    const updatedTodos = todoList.map((todo) => {
        if (todo.id === todoId) {
        return { ...todo, isCompleted: true };
    }
        return todo;
    });
  setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList}
        onCompleteTodo={completeTodo}/>
    </div>
  )
}
export default App