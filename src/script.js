let valueInput = "";
let input = null;
let flag = 0;
let allTasks = [];
let editInput = null;

window.onload = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });
  let result = await resp.json();
  allTasks = result.data;

  render();
};

const onClickButton = async () => {
  const resp = await fetch("http://localhost:8000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    }),
  });
  
  let result = await resp.json();
  allTasks = result.data;
  valueInput = "";
  input.value = "";

  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

const render = () => {
  const content = document.getElementById("contentPage");
  allTasks.reverse();
  allTasks.sort((a, b) => (b.isCheck === false) - (a.isCheck === false));
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }

  allTasks.map((item, index) => {

    let textIndex = allTasks[index].text;
    let idIndex = allTasks[index]._id;
    let isCheckIndex = allTasks[index].isCheck;

    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    if (allTasks[index].flag === 1) {
      editInput = document.createElement("input");
      editInput.type = "text";
      editInput.addEventListener("change", updateValue);
      editInput.value = allTasks[index].text;
      container.appendChild(editInput);
      const acceptButton = document.createElement("button");
      acceptButton.onclick = () => acceptFun(textIndex, idIndex);

      container.appendChild(acceptButton);
      const imageAccept = document.createElement("img");
      imageAccept.src = "img/accept.svg";
      acceptButton.appendChild(imageAccept);
      const cancelButton = document.createElement("button");
      cancelButton.onclick = () => cancelFun(index);

      container.appendChild(cancelButton);
      const imageCancel = document.createElement("img");
      imageCancel.src = "img/cancel.svg";
      cancelButton.appendChild(imageCancel);
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = allTasks[index].isCheck;
      checkbox.onclick = () =>
        onChangeCheckBox(textIndex, isCheckIndex, idIndex);

      container.appendChild(checkbox);
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-text" : "text-task";
      container.className = item.isCheck
        ? "task-container-done"
        : "task-container";
      container.appendChild(text);
      const deleteButton = document.createElement("button");

      if (allTasks[index].isCheck === false) {
        const editButton = document.createElement("button");
        editButton.onclick = () => editeFun(index);
        container.appendChild(editButton);

        const imageEdit = document.createElement("img");
        imageEdit.src = "img/editor.svg";
        editButton.appendChild(imageEdit);
      }

      deleteButton.onclick = () => deleteFun(idIndex);
      container.appendChild(deleteButton);
      const imageRemove = document.createElement("img");
      imageRemove.src = "img/remove.svg";
      deleteButton.appendChild(imageRemove);
    }

    content.appendChild(container);
  });
};

const deleteFun = async (idIndex) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${idIndex}`, {
    method: "DELETE",
  });
  let result = await resp.json();
  allTasks = result.data;

  render();
};

const editeFun = (index) => {
  allTasks[index].flag = 1;

  render();
};

const onChangeCheckBox = async (textIndex, isCheckIndex, idIndex) => {
  isCheckIndex = !isCheckIndex;
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: textIndex,
      isCheck: isCheckIndex,
      id: idIndex,
    }),
  });
  let result = await resp.json();
  allTasks = result.data;

  render();
};
const acceptFun = async (textIndex, idIndex) => {
  textIndex = valueInput;
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: textIndex,
      id: idIndex,
    }),
  });
  let result = await resp.json();
  allTasks = result.data;

  render();
};

const cancelFun = (index) => {
  allTasks[index].flag = -1;

  render();
};
