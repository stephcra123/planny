  import TodoList from './features/TodoList/TodoList.jsx'
  import TodoForm from './features/TodoForm.jsx'
  import { useState, useEffect, useCallback } from 'react'
  import TodosViewForm from './features/TodosViewForm.jsx'
  import './App.css'                    
  import styles from './App.module.css'
  import {
    reducer as todosReducer,
    actions as todoActions,
    initialState as initialTodosState,
  }  from './reducers/todos.reducer';
  import { useReducer } from 'react';

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  //const encodeUrl = ({ sortField, sortDirection, queryString }) => 
  function App() {
    const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

    //const [todoList, setTodoList] = useState([])
    //const [isLoading, setIsLoading] = useState(false)
    //const [errorMessage, setErrorMessage] = useState("")
    //const [isSaving, setIsSaving] = useState(false)
    const [sortField, setSortField] = useState("createdTime")
    const [sortDirection, setSortDirection] = useState("desc")
    const [queryString, setQueryString] = useState("")
    const encodeUrl = useCallback(()=>{
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}", {Title})`; 
  }
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
   ;},[sortField, sortDirection, queryString])
   
    useEffect(() => {
      const fetchTodos = async () => {
        const options = {
          method: 'GET',
          headers:{'Authorization': token}
        };

        try {
          const resp = await fetch(encodeUrl(), options)
          if(!resp.ok) {throw new Error(resp.message)}
          const data = await resp.json();
          dispatch({ type: todoActions.loadTodos, records: data.records });
        }
        catch (error) {dispatch({ type: todoActions.setLoadError, error: error });
        }
      }
      fetchTodos();
    }, [sortDirection, sortField, queryString]);

    const updateTodo = async (editedTodo) => {
      const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
      dispatch({ type: todoActions.updateTodo, editedTodo });
      const payload = {
      records: [
       {
        id: editedTodo.id,
        fields: {
          Title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          },
        },
        ],
      };
      const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      };
    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error('Failed to update todo');
    }
    } 
  catch (error) {
    dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo, error: error });
      }
    
  };
  
    const addTodo = async (newTodo) => {
      const payload = {
        records: [
          {
            fields: {
              Title: newTodo.title,
              isCompleted: newTodo.isCompleted,
            },
          },
        ],
      };
      const options = {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      };
      try {
        dispatch({ type: todoActions.startRequest });
        const resp =  await fetch (encodeUrl(), options);
        if (!resp.ok) {
          throw new Error('Failed to add todo');
        }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
      } catch (error) {
        //console.error(error)
          dispatch({ type: todoActions.setLoadError, error: error });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    }
    const completeTodo = async (todoId) => {
      const originalTodo = todoState.todoList.find((todo) => todo.id === todoId);
      dispatch({ type: todoActions.completeTodo, todoId });

      const payload = {
        records: [
          {
            id: todoId,
            fields: {
              isCompleted: true
            }
          }
        ]
      };
      const options = {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo, error: error });
    }
  
    
  };

    return (
      <div className={styles.app}>
        <h1>My Todos</h1>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <TodoList
          onUpdateTodo={updateTodo} 
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          isLoading={todoState.isLoading}
          />
           <hr />
            <TodosViewForm 
             sortDirection={sortDirection}
             setSortDirection={setSortDirection}
             sortField={sortField}
             setSortField={setSortField}
             queryString={queryString}
             setQueryString={setQueryString}
           />
        {todoState.errorMessage && (
        <div className={styles.error}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
    )
  }
  export default App