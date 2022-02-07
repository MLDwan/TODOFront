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

render = () => {
  const content = document.getElementById("contentPage");
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    if (allTasks[index].flag === 1) {
      const edInput = document.createElement("input");
      edInput.addEventListener("change", updateValue);
      edInput.type = "text";
      edInput.value = allTasks[index].text;
      container.appendChild(edInput);
      const acceptButton = document.createElement("button");
      acceptButton.onclick = function () {
        acceptFun(index);
      };

      container.appendChild(acceptButton);
      const imageAccept = document.createElement("img");
      imageAccept.src = "img/accept.svg";
      acceptButton.appendChild(imageAccept);

      const cancelButton = document.createElement("button");
      cancelButton.onclick = function () {
        cancelFun(index);
      };

      container.appendChild(cancelButton);
      const imageCancel = document.createElement("img");
      imageCancel.src = "img/cancel.svg";
      cancelButton.appendChild(imageCancel);
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.isCheck;
      checkbox.onclick = function () {
        onChangeCheckBox(item, index);
      };

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
        const editBut = document.createElement("button");
        editBut.onclick = function () {
          editeFun(index);
        };

        container.appendChild(editBut);
        const imageEdit = document.createElement("img");
        imageEdit.src = "img/editor.svg";
        editBut.appendChild(imageEdit);
      }

      deleteButton.onclick = () => {
        deleteFun(index);
      };

      container.appendChild(deleteButton);
      const imageRemove = document.createElement("img");
      imageRemove.src = "img/remove.svg";
      deleteButton.appendChild(imageRemove);
    }

    content.appendChild(container);
  });
};

deleteFun = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteTask?id=${allTasks[index].id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );

  let result = await resp.json();
  allTasks = result.data;

  render();
};

editeFun = (index) => {
  allTasks[index].flag = 1;

  render();
};

onChangeCheckBox = async (item, index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  const res = item;
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: allTasks[index].text,
      isCheck: allTasks[index].isCheck,
      id: allTasks[index].id,
    }),
  });

  if (allTasks[index].isCheck === true) {
    allTasks.splice([index], 1);
    allTasks.push(res);
  } else {
    allTasks.splice([index], 1);
    allTasks.unshift(res);
  }

  let result = await resp.json();
  allTasks = result.data;

  render();
};

acceptFun = async (index) => {
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
      text: valueInput,
      id: allTasks[index].id,
    }),
  });
  let result = await resp.json();
  allTasks = result.data;

  render();
};

cancelFun = (index) => {
  allTasks[index].flag = 0;
  localStorage.setItem("tasks", JSON.stringify(allTasks));

  render();
};

allRemove = () => {
  allTasks.splice(0, allTasks.length);
  localStorage.setItem("tasks", JSON.stringify(allTasks));

  render();
};
