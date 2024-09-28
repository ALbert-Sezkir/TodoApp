//Måste Connecta HTML och Javascript genom the DOM,
const button = document.querySelector("#add-todo-btn"); 
const delIcon = document.querySelector("#fa-solid fa-trash");
const form = document.querySelector("#todoFormform");
let formInput = document.querySelector("#todo-input");
let ul = document.querySelector("#todoFormtodoList");
let emptyInputMsgContainer = document.querySelector("#emptyInputMsgContainer");

const URI = "https://js1-todo-api.vercel.app/api/todos";
const API_KEY = "?apikey=2c54c551-874b-4aec-899b-c9937033086c";

//Create list delete button
const deleteButton = (li) => {
  const img = document.createElement("img");
  img.setAttribute("id", "deleteButton");
  img.setAttribute("src", "../images/delete-button.svg");
  li.appendChild(img);
};


//Function that shows the lists on the screen
const renderUI = (data) => {
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    li.innerText = data[i].title;
    li.setAttribute("id", data[i]._id);
    ul.appendChild(li);
    deleteButton(li);
    
  }
};

//Get todos on page load
const fetchTodoList = async () => {
  const response = await fetch(URI + API_KEY);
  const data = await response.json();
  //Call the function with the data from the server
  renderUI(data);
};

//Add todo
const addTodo = async (inputValue) => {
  //Create logic that checks if the input value is empty or if it has content
  if (inputValue === "") {
    //if it is empty render the error text
    emptyInputMsgContainer.innerText =
      "Invalid input content, you must write something!";
  } else {
    emptyInputMsgContainer.innerText = "";
    await saveTodo({
      title: inputValue,
    });

    formInput.value = "";
    await fetchTodoList();
  }
};

//Save todo
const saveTodo = async (postData) => {
  const response = await fetch(URI + API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  const json = await response.json();
  return json;
};

// Delete todo
const deleteTodo = async (id) => {
  await fetch(`${URI}/${id}${API_KEY}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Function to handle the click event on the delete button
const handleDeleteButtonClick = async (event) => {
  if (event.target.matches("#deleteButton")) {
    event.preventDefault();
    // Get the ID from the parent element
    const todoId = event.target.parentElement.id;

    // Delete the todo
    await deleteTodo(todoId);

    // Remove the parent element from the DOM
    event.target.parentElement.remove();
  }
};

//Set up event delegation
ul.addEventListener("click", handleDeleteButtonClick);

// Create the delete button
const createDeleteButton = async () => {
  await fetchTodoList();
};

createDeleteButton();

//Add todo on form submit
form.addEventListener("submit", (event) => {
  //Prevent the browser window from updating
  event.preventDefault();
  //Update list when you click the button
  addTodo(event.target[0].value);
});
