import { useRef } from "react"

function TodoForm({onAddTodo}) {
    const todoTitleInput = useRef("");
    function handleAddTodo(event){
        event.preventDefault()
        //console.dir(event.target.title)
        const title = event.target.title.value
        onAddTodo(title)
        todoTitleInput.current.focus()
        event.target.title.value = ""
        
    }
    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input id="todoTitle" name= "title" ref = {todoTitleInput}/> 
            <button>Add Todo</button>

        </form>
    )
}
export default TodoForm