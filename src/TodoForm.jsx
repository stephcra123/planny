import { useRef } from "react"
import { useState } from 'react'

function TodoForm({onAddTodo}) {
    const todoTitleInput = useRef("");
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    function handleAddTodo(event){
        event.preventDefault()
        //const title = event.target.title.value
        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle('');
        todoTitleInput.current.focus()
        //event.target.title.value = ""
        
    }
    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input id="todoTitle" name= "title" 
                ref = {todoTitleInput} 
                value = {workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            /> 
            <button disabled={workingTodoTitle === ""}>Add Todo</button>

        </form>
    )
}
export default TodoForm