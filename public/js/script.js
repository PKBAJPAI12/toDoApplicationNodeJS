console.log("js");
let getText = document.getElementById("textcontent");
let parent = document.getElementById("notesection");
let rparent = document.getElementById("alerthead");
let newele = document.createElement("h3");
let table = document.createElement("table");
let tr1 = document.createElement("tr");
let th1 = document.createElement("th");
let th2 = document.createElement("th");
let th3 = document.createElement("th");
let th4 = document.createElement("th");
th1.innerHTML = "Notes Name";
th2.innerHTML = "Update";
th3.innerHTML = "Status";
th4.innerHTML = "Delete";
tr1.setAttribute("class", "trclass")

tr1.appendChild(th1);
tr1.appendChild(th2);
tr1.appendChild(th3);
tr1.appendChild(th4);


table.appendChild(tr1);

table.setAttribute("class", "tableclass");


let lastEle = null;
let notes;
let getAllTodoReq = new XMLHttpRequest();
getAllTodoReq.open("GET", "https://todoapplication-3p34g89v3jl8vxetou.codequotient.in/todo");
getAllTodoReq.send();
getAllTodoReq.addEventListener("load", todoData);
getText.addEventListener("keydown", addNote);

function todoData() {
  if (getAllTodoReq.status === 200) {
    console.log("sucess");
    let todos = JSON.parse(getAllTodoReq.responseText);
    console.log(todos);
    notes=todos;
    if (todos.length > 0) {
      todos.forEach(function (todo, idx) {
        getNote(todo.val, idx);
        console.log(idx);

      })
    }
    else {
      newele.innerHTML = "Note Book is Empty";
      newele.style.color = "red";
    }
    newele.style.textAlign = "center";
    newele.style.marginBottom = "1rem";
    if (lastEle) {
      rparent.removeChild(lastEle);
    }
    rparent.appendChild(newele);
    lastEle = newele;

  }
  else {
    console.log("Error Occured");
  }

}

// Get Notes in App 
function getNote(value, id) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");
  td1.innerHTML = value;
  td2.innerHTML = "<span>&#9998</span>";
  td3.innerHTML = "<input type='checkbox' class='check'></input>";
  td4.innerHTML = "<span>&times;</span>";
  tr.setAttribute("class", "trclass")
  td1.setAttribute("class", "td1class")
  td2.setAttribute("class", "td2class")
  td3.setAttribute("class", "td2class")
  td4.setAttribute("class", "td2class")
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  table.appendChild(tr);
  parent.appendChild(table);


  console.log(parent);
  //getText.value = "";

  td2.addEventListener("click", function () {
    td1.innerHTML = `<textarea id='updateta' cols='100' rows='2'>${td1.innerHTML}</textarea>`;
    let updateta = document.getElementById('updateta');
    td1.addEventListener("keydown", updateNote);
    function updateNote(event) {
      if (event.key == 'Enter') {
        if (updateta.value.length > 0) {
          td1.innerHTML = `<td class='td1class'>${updateta.value}</td>`;
          newele.innerHTML = "Note is Updated Successfully";
          newele.style.color = "Green";

        }
      }
    }
  })
    td4.addEventListener("click", function () {
    deleteNote(tr,id);
  });

}

function addNote(event) {
  if (event.key == "Enter") {

    if (getText.value.length > 0) {
      let req = new XMLHttpRequest();
      req.open("POST", "https://todoapplication-3p34g89v3jl8vxetou.codequotient.in/todo");
      req.setRequestHeader("Content-Type", "application/json")
      let note = {
        val: getText.value
      }
      req.send(JSON.stringify(note));
      req.addEventListener("load", function () {
        if (req.status === 200) {
          console.log(req.status);
          let todolen=notes.length;
          let signlereq = new XMLHttpRequest();
      signlereq.open("POST", `https://todoapplication-3p34g89v3jl8vxetou.codequotient.in/todo/${todolen}`);
      console.log(`https://todoapplication-3p34g89v3jl8vxetou.codequotient.in/todo/${todolen}`);
      signlereq.setRequestHeader("Content-Type", "application/json");
      signlereq.send(JSON.stringify(note));
      console.log(JSON.stringify(note));
          notes.push({val:getText.value});
            getNote(getText.value,todolen);
          
        }
      })

      newele.innerHTML = "Note is Added Successfully";
      newele.style.color = "Green";

    }
    else if (getText.value.length == 0) {
      newele.innerHTML = "Required to Add Text Note";
      newele.style.color = "orange";
    }
    newele.style.textAlign = "center";
    newele.style.marginBottom = "1rem";
    if (lastEle) {
      rparent.removeChild(lastEle);
    }
    rparent.appendChild(newele);
    lastEle = newele;

  }

}

function deleteNote(tr,id) {
  let deltr = table.removeChild(tr);
  parent.appendChild(table);
  notes.splice(id,1);
  let deleteReq = new XMLHttpRequest();
  deleteReq.open("POST", `https://todoapplication-3p34g89v3jl8vxetou.codequotient.in/tododelete`);
  console.log(`${id}`);
deleteReq.setRequestHeader("Content-Type","application/json");
  deleteReq.send(JSON.stringify({id:id}));
  deleteReq.addEventListener("load",function(){
console.log(`deleted ${id}`);
  })
  newele.innerHTML = "Note is Deleted Successfully";
  newele.style.color = "Red";

}
