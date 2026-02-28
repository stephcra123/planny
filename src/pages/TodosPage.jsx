import TodoForm from '../features/TodoForm'
import TodoList from '../features/TodoList/TodoList'
import TodosViewForm from '../features/TodosViewForm'
import { useSearchParams, useNavigate } from 'react-router'
import { useEffect } from 'react'

function TodosPage({
    todoState,
    addTodo,
    updateTodo,
    completeTodo,
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString,
    dispatch,
    todoActions,

}){
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const itemsPerPage = 15
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage
    const filteredTodoList = todoState.todoList.filter(todo => !todo.isCompleted)
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage)
    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage)

    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
        setSearchParams({ page: currentPage - 1 })
        }
    }
    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setSearchParams({ page: currentPage + 1 })
        }
    }
    useEffect(() => {
        if (totalPages > 0) {
            if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > totalPages ) {
             navigate('/')
            }
        }
    }, [currentPage, totalPages, navigate])

    console.log(todoState.todoList.length)
    return (
    <>
    <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
    <TodoList
        onUpdateTodo={updateTodo} 
        todoList={currentTodos}
        onCompleteTodo={completeTodo}
        isLoading={todoState.isLoading}
        />
        <div className="paginationControls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} >Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
        <hr />
        <TodosViewForm 
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortField={sortField}
            setSortField={setSortField}
            queryString={queryString}
            setQueryString={setQueryString}
        />
           </>
)}
export default TodosPage