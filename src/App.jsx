  import TodoList from './features/TodoList/TodoList.jsx'
  import TodoForm from './features/TodoForm.jsx'
  import { useState, useEffect, useCallback } from 'react'
  import TodosViewForm from './features/TodosViewForm.jsx'
  import './App.css'                    
  import styles from './App.module.css'
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  //const encodeUrl = ({ sortField, sortDirection, queryString }) => 
  function App() {
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)
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
        setIsLoading(true);
        const options = {
          method: 'GET',
          headers:{'Authorization': token}
        };

        try {
          const resp = await fetch(encodeUrl(), options)
          if(!resp.ok) {throw new Error(resp.message)}
          const data = await resp.json();
          const todos = data.records.map((record) => ({
            id: record.id,
            title: record.fields.Title,
            isCompleted: record.fields.isCompleted || false
          }));
          setTodoList(todos); 
        }
        catch (error) {throw new Error(error.message)}
        finally {setIsLoading(false)}
        }
      fetchTodos();
    }, [sortDirection, sortField, queryString]);

    const updateTodo = async (editedTodo) => {
      const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
      const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...todo, title: editedTodo.title };
      }
      return todo;
      });
      setTodoList(updatedTodos);
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
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === editedTodo.id) {
          return originalTodo;
        }
      return todo;
    });
    setTodoList(revertedTodos);
    } 
    finally {
    setIsSaving(false);
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
        setIsSaving(true);
        const resp =  await fetch (encodeUrl(), options);
        if (!resp.ok) {
          throw new Error('Failed to add todo');
        }
      const { records } = await resp.json();
      const savedTodo = {
       id: records[0].id,
       title: records[0].fields.Title,
       isCompleted: records[0].fields.isCompleted || false
    };
    setTodoList([...todoList, savedTodo]);
      } catch (error) {
        console.error(error)
          setErrorMessage(`${error.message}. Reverting todo...`);
      } finally {
        setIsSaving(false);
      }
    }
    const completeTodo = async (todoId) => {
      const originalTodo = todoList.find((todo) => todo.id === todoId);
      const updatedTodos = todoList.map((todo) => {
          if (todo.id === todoId) {
          return { ...todo, isCompleted: true };
      }
          return todo;
      });
    setTodoList(updatedTodos);
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
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === todoId) {
          return originalTodo;
        }
        return todo;
      });
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

    return (
      <div className={styles.app}>
        <h1>My Todos</h1>
        <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
        <TodoList
          onUpdateTodo={updateTodo} 
          todoList={todoList}
          onCompleteTodo={completeTodo}
          isLoading={isLoading}
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
        {errorMessage && (
        <div className={styles.error}>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
    )
  }
  export default App