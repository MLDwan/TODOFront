let valueInput = "";
let input = null;
let flag = 0;

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
  allTasks.unshift({
    text: valueInput,
    isCheck: false,
    flag: 0,
  });

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
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    if (allTasks[index].flag === 1) {
      const editInput = document.createElement("input");
      editInput.addEventListener("change", updateValue);
      editInput.type = "text";
      editInput.value = allTasks[index].text;
      container.appendChild(editInput);
      const acceptButton = document.createElement("button");
      acceptButton.onclick = () => acceptFun(index);

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
      checkbox.checked = item.isCheck;
      checkbox.onclick = () => onChangeCheckBox(item, index);

      container.appendChild(checkbox);
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-text" : "text-task";
      container.className = item.isCheck
        ? "task-container-done"
        : "task-container";
      container.appendChild(text);
      const deleteButton = document.createElement("button");
      deleteButton.onclick = () => deleteFun(index);

      if (allTasks[index].isCheck === false) {
        const editButton = document.createElement("button");
        editButton.onclick = () => editeFun(index);

        container.appendChild(editButton);
        const imageEdit = document.createElement("img");
        imageEdit.src = "img/editor.svg";
        editButton.appendChild(imageEdit);
      }

      container.appendChild(deleteButton);
      const imageRemove = document.createElement("img");
      imageRemove.src = "img/remove.svg";
      deleteButton.appendChild(imageRemove);
    }

    content.appendChild(container);
  });
};

const deleteFun = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteTask?id=${allTasks[index].id}`,
    {
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

const onChangeCheckBox = async (item, index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: allTasks.text,
      isCheck: allTasks[index].isCheck,
      id: allTasks[index].id,
    }),
  });

  let result = await resp.json();
  result.data.sort((a, b) => 
  (b.isCheck === false) - (a.isCheck === false))
  allTasks = result.data;

  render();   
};

const acceptFun = async (index) => {
  allTasks[index].flag = 0;
  allTasks.text = valueInput;
  allTasks[index].text = valueInput;

  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: allTasks.text,
      id: allTasks[index].id,
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

const allRemove = async() => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, {
    method: "DELETE",
  });

  let result = await resp.json();
  allTasks = result.data;

  render();
};
