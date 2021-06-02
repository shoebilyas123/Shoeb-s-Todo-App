"script";
// Buttons
const btnCreateTodo = document.querySelector(".create_btn");
const btnChangeText = document.querySelector(".edit_todo_text");

// Input Fields
const inputCreateText = document.querySelector(".create_text");
const inputEditText = document.querySelector("#edit_text");

// Labels and texts
const todoContainer = document.querySelector(".todo_container");
const overlay = document.querySelector(".overlay");

const todoList = document.querySelectorAll(".todo");

class App {
  #myTodos = [];
  #listSize = todoList.length;
  #defaultText = "Create a new todo...";
  #defaultText2 = "Enter a valid todo first!";
  #maxtodoLength = 55;
  constructor() {
    this._getLocalStorage();
    inputCreateText.addEventListener("click", this._changeInputOnClick);
    btnCreateTodo.addEventListener("click", this._createNewTodo.bind(this));
    todoContainer.addEventListener(
      "click",
      this._detectContainerElement.bind(this)
    );
  }

  _displayNoListText(size) {
    const html = `<p class="no-todo_text" style="width: 80%; color: white; text-align: center; margin: auto; margin-top: 50px;">Your todo list is empty. Let's do some work!</p>`;
    if (size === 0) todoContainer.insertAdjacentHTML("beforeend", html);
  }
  _isTodoValid() {
    // if (inputCreateText.value.length > this.#maxtodoLength) {
    //   alert("Craete a todo not an essay!");
    //   return false;
    // }
    return (
      this.#myTodos.every((todo) => todo !== inputCreateText.value) &&
      inputCreateText.value !== "" &&
      inputCreateText.value !== this.#defaultText &&
      inputCreateText.value !== this.#defaultText2
    );
  }
  _changeInputOnClick() {
    inputCreateText.value = "";
  }

  _deleteThisElement(elem) {
    elem.remove();
  }

  _toggleCheckedClasses(ele) {
    ele.closest(".check_btn").classList.toggle("checked");
    ele.closest(".todo").classList.toggle("todo__done");
  }

  _toggleDone(ele) {
    const htmlCheckMark = `<i class="fas fa-check"></i>`;

    if (ele.classList.contains("checked")) {
      const iconDelete = ele.querySelector(".fa-check");
      ele.removeChild(iconDelete);
      ele.closest(".generic").children[1].style.textDecoration = "none";
    } else {
      ele.insertAdjacentHTML("afterbegin", htmlCheckMark);
      ele.closest(".generic").children[1].style.textDecoration = "line-through";
    }
    this._toggleCheckedClasses(ele);
  }

  _editTodo(ele) {
    const editText = ele.closest(".todo").querySelector(".todo_text");
    inputEditText.value = editText.textContent;
    overlay.classList.remove("hidden");

    btnChangeText.addEventListener("click", function () {
      editText.textContent = inputEditText.value;
      overlay.classList.add("hidden");
    });
  }

  _createHTML(v) {
    return `<div class="todo">
    <div class="generic">
      <div class="check_btn">
      </div>
      <p class="todo_text">${v}</p>
    </div>
    <div class="functionalities">
      <button class="btn btn_edit"><i class="fas fa-edit"></i></button>
      <button class="btn btn_delete">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </div>`;
  }

  _createNewTodo() {
    if (this._isTodoValid() === false) {
      inputCreateText.value = this.#defaultText2;
      return;
    }
    const html = this._createHTML(inputCreateText.value);

    this.#myTodos.push(inputCreateText.value);
    this._setLocalStorage();
    todoContainer.insertAdjacentHTML("beforeend", html);

    this.#listSize += 1;
    if (this.#listSize === 1)
      todoContainer.querySelector(".no-todo_text").remove();
  }

  _detectContainerElement(e) {
    let ele = e.target;
    if (
      ele.classList.contains("btn_delete") ||
      ele.classList.contains("fa-trash-alt")
    ) {
      // Deleting todo
      const todoToBeDeleted = e.target.closest(".todo");

      const todoDText = e.target
        .closest(".todo")
        .querySelector(".todo_text").value;

      this.#myTodos.splice(this.#myTodos.indexOf(todoDText), 1);
      this._deleteThisElement(todoToBeDeleted);
      this.#listSize -= 1;
      this._displayNoListText(this.#listSize);
      this._setLocalStorage();
    } else if (ele.classList.contains("check_btn")) {
      this._toggleDone(ele);
    } else if (ele.classList.contains("fa-check")) {
      ele.closest(".generic").children[1].style.textDecoration = "none";
      ele = ele.closest(".check_btn");
      this._deleteThisElement(ele.children[0]);
      this._toggleCheckedClasses(ele);
    } else if (
      ele.classList.contains("btn_edit") ||
      ele.classList.contains("fa-edit")
    ) {
      this._editTodo(ele);
    }
  }

  _setLocalStorage() {
    localStorage.setItem("myTodos", JSON.stringify(this.#myTodos));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("myTodos"));

    if (!data) {
      this.#listSize = 0;
      this._displayNoListText(this.#listSize);

      return;
    }
    data.forEach((item) => {
      const html = this._createHTML(item);
      this.#myTodos.push(item);
      todoContainer.insertAdjacentHTML("beforeend", html);
    });

    this.#listSize = this.#myTodos.length;
    this._displayNoListText(this.#listSize);
  }
}

// Running App
const app = new App();
