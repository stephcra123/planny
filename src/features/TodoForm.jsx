import { useRef, useState } from "react"
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx"
import styled from 'styled-components'

const StyledForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
`
const StyledButton = styled.button`
  font-style: ${(props) => props.disabled ? 'italic' : 'normal'};
`

function TodoForm({onAddTodo, isSaving}) {
    const todoTitleInput = useRef("");
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');
    function handleAddTodo(event){
        event.preventDefault()
        //const title = event.target.title.value
        onAddTodo({ title: workingTodoTitle, isCompleted: false })
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
            <button disabled={workingTodoTitle.trim() === ''}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </button>

        </form>
    )
}
export default TodoForm