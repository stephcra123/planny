import { useRef } from "react"
import { useState } from 'react'
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx"

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
            <TextInputWithLabel
                ref = {todoTitleInput}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
                value= {workingTodoTitle}
                elementId = "todoTitle"
                labeltext = "Todo"
            /> 
            <button disabled={workingTodoTitle === ""}>Add Todo</button>

        </form>
    )
}
export default TodoForm