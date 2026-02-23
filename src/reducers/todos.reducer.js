const initialState = {
    todoList: [],
    isLoading: false,
    errorMessage: "",
    isSaving: false,
};
const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    //Use Effect Cases
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
            id: record.id,
            title: record.fields.Title,
            isCompleted: record.fields.isCompleted || false
        })),
        isLoading: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    //Add Todo Cases
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:{
        const savedTodo = {
            id: action.records[0].id,
            title: action.records[0].fields.Title,
            isCompleted: action.records[0].fields.isCompleted || false
        };
        return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
        };
    }
    case actions.endRequest:
      return {
        ...state,
        isSaving: false,
        isLoading: false,
      };
    //Update and Complete Todo Cases
    case actions.updateTodo:{
        const updatedTodos = state.todoList.map((todo) => {
            if (todo.id === action.editedTodo.id) {
                return { ...todo, title: action.editedTodo.title };
            }
            return todo;
        });
        const updatedState = { ...state, todoList: updatedTodos };
        if (action.error) {
            updatedState.errorMessage = action.error.message;}
      return updatedState;
    }
    case actions.completeTodo:{
        const updatedTodos = state.todoList.map((todo) => {
            if (todo.id === action.todoId) {
                return { ...todo, isCompleted: true };
            }
      return todo;
    });
    return{ ...state, todoList:updatedTodos };
    }
    case actions.revertTodo: {
        const updatedTodos = state.todoList.map((todo) => {
            if (todo.id === action.originalTodo.id) {
            return action.originalTodo;
        }
    return todo;
 });
        const updatedState = { ...state, todoList: updatedTodos };
            if (action.error) {
            updatedState.errorMessage = action.error.message;
            }
        return updatedState;
}
    //Dismiss Error Case
    case actions.clearError:
      return {
        ...state,
        errorMessage: "",
      };
    default:
      return state;
  }
}

export { initialState, actions, reducer };

/*Notes on States from App.jsx:

Initial States:
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")            
    const [isSaving, setIsSaving] = useState(false)

todoList: an Array holdings list of todo objects, each with id, title, and isCompleted properties
    1) Set Initial
    2) in update_todo find original todo before updating
    3) Map over and update the todoList state with the edited todo
    4) Catch if fails and revert todoList to original (Pesimistic fallback)
    5) in complete_todo, find original todo before updating
    6) Map over and update the todoList state with the completed todo
    7) Catch if fails and revert todoList to original (Pesimistic fallback)
    
setTodoList calls:
    1)Use_effect after fetching todos
    2)In update_todo after optimistically updating the UI
    3)In complete_todo after optimistically updating the UI
    4)In add_todo after optimistically adding the new todo to the list
    5)In delete_todo after optimistically removing the todo from the list
    6)In sort_todos after sorting the list based on the selected field and direction
    7)In search_todos after filtering the list based on the search query


isLoading: a Boolean indicating whether the app is currently fetching data from the API
    1) Initial
    2) Set to true at the start of useEffect before fetching todos
    3) Set to false in the finally block of useEffect after fetch completes
    4) Read in TodoList component as a prop to show loading spinner

setIsLoading calls:
    1) useEffect — setIsLoading(true) before fetch starts
    2) useEffect finally block — setIsLoading(false) after fetch completes


errorMessage: a String to hold any error messages that may occur during API calls
    1) Set Initial to empty string ""
    2) Set in useEffect catch block if fetch fails
    3) Set in addTodo catch block if save fails
    4) Set in updateTodo catch block if update fails
    5) Set in completeTodo catch block if complete fails
    6) Cleared back to "" when user clicks Dismiss button
    7) Read in JSX to conditionally show error div and message

setErrorMessage calls:
    1) useEffect catch — setErrorMessage(error.message)
    2) addTodo catch — setErrorMessage(error.message)
    3) updateTodo catch — setErrorMessage(error.message)
    4) completeTodo catch — setErrorMessage(error.message)
    5) Dismiss button onClick — setErrorMessage("")


isSaving: a Boolean indicating whether the app is currently saving data to the API
    1) Set Initial to false
    2) Set to true at the start of addTodo before API call
    3) Set to false in the finally block of addTodo after save completes
    4) Set to false in the finally block of updateTodo after update completes
    5) Set to false in the finally block of completeTodo after complete completes
    6) Read in TodoForm component as a prop to disable submit button while saving

setIsSaving calls:
    1) addTodo try block — setIsSaving(true) before fetch starts
    2) addTodo finally block — setIsSaving(false) after fetch completes
    3) updateTodo finally block — setIsSaving(false) after fetch completes
    4) completeTodo finally block — setIsSaving(false) after fetch completes
*/