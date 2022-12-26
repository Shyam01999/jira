let addBtn = document.querySelector(".add-btn");
let modal = document.querySelector(".toolbox-main-cont");
let textCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let priortyColor = document.querySelectorAll(".priorty-color");
let removeBtn = document.querySelector(".remove-btn");
let ticket = document.querySelectorAll(".ticket-cont");
let toolboxColor = document.querySelectorAll(".color");
let addModal = true;
let color = ["lightpink", "lightblue", "lightgreen", "lightblack"];
let modalPriortyColor = color[color.length - 1];
let addBtnColor = true;
var uid = new ShortUniqueId();

let ticketArr = [];

if(localStorage.getItem("tickets")){
  let str = localStorage.getItem("tickets");
  let arr = JSON.parse(str);
  ticketArr = arr;
  for(let i=0; i<arr.length; i++){
    let ticketObj = arr[i];
    createTicket(ticketObj.color, ticketObj.task, ticketObj.id)

  }
} 

for (let i = 0; i < toolboxColor.length; i++) {
  toolboxColor[i].addEventListener("click", function () {
    let currentToolboxColor = toolboxColor[i].classList[1];
    let filterArr = [];
    for (let i = 0; i < ticketArr.length; i++) {
      if (ticketArr[i].color == currentToolboxColor) {
        filterArr.push(ticketArr[i]);
      }
    }
       console.log(filterArr);
    let allticket = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allticket.length; j++) {
      allticket[j].remove();
    }

    for (let i = 0; i < filterArr.length; i++) {
      let ticket = filterArr[i];
      let color = ticket.color;
      let id = ticket.id;
      let task = ticket.task;
      createTicket(color, task, id);
    }

    toolboxColor[i].addEventListener("dblclick", function () {
      let allticket = document.querySelectorAll(".ticket-cont");
      for (let j = 0; j < allticket.length; j++) {
        allticket[j].remove();
      }

      for (let i = 0; i < ticketArr.length; i++) {
        let ticket = ticketArr[i];
        let color = ticket.color;
        let id = ticket.id;
        let task = ticket.task;
        console.log(color);
        console.log(id);
        console.log(task);
        createTicket(color, task, id);
      }
    });
  });
}

addBtn.addEventListener("click", () => {
  if (addModal) {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
  addModal = !addModal;
});

removeBtn.addEventListener("click", () => {
  if (addBtnColor) {
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "black";
  }
  addBtnColor = !addBtnColor;
});

for (let i = 0; i < priortyColor.length; i++) {
  let allPriortyColor = priortyColor[i];
  allPriortyColor.addEventListener("click", () => {
    for (let j = 0; j < priortyColor.length; j++) {
      priortyColor[j].classList.remove("active");
    }
    allPriortyColor.classList.add("active");
    modalPriortyColor = allPriortyColor.classList[1];
    // console.log(modalPriortyColor);
  });
}

modal.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key == "Enter") {
    createTicket(modalPriortyColor, textCont.value);
    textCont.value = " ";
    modal.style.display = "none";
    addModal = !addModal;
  }
});

  function createTicket (ticketColor, task, ticketId) {
  let id;
  if (ticketId == undefined) {
    id = uid();
  } else {
    id = ticketId;
  }
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                 <div class="ticket-id">#${id}</div>
                 <div class="task-area">${task}</div>
                 <div class="lock-unlock"><i class="icon-lock"></i></div>`;
  mainCont.appendChild(ticketCont);

  //lock unlock handle
  let lockunlockBtn = ticketCont.querySelector(".lock-unlock i");
  let taskArea = ticketCont.querySelector(".task-area");
  lockunlockBtn.addEventListener("click", () => {
    if (lockunlockBtn.classList.contains("icon-lock")) {
      lockunlockBtn.classList.remove("icon-lock");
      lockunlockBtn.classList.add("icon-unlocked");
      taskArea.setAttribute("contentEditable", "true");
    } else {
      lockunlockBtn.classList.remove("icon-unlocked");
      lockunlockBtn.classList.add("icon-lock");
      taskArea.setAttribute("contentEditable", "false");
    }

    //update ticket task area as well
    let ticketIdx = getTicketIdx(id);
    ticketArr[ticketIdx].task = taskArea.textContent;
    updateLocalStorage();
  });

  //handle delete
  ticketCont.addEventListener("click", () => {
    if (!addBtnColor) {
      ticketCont.remove();
      //update UI
      let ticketIdx = getTicketIdx(id)
      ticketArr.splice(ticketIdx, 1);
      updateLocalStorage();
    }
  });

  //handle color
  let ticketBandColor = ticketCont.querySelector(".ticket-color");
  ticketBandColor.addEventListener("click", function () {
    let currentTicketColor = ticketBandColor.classList[1];
    let currentTicketColorIdx = -1;
    for (let i = 0; i < color.length; i++) {
      if (currentTicketColor == color[i]) {
        currentTicketColorIdx = i;
        break;
      }
    }
    let nextTicketColorIdx = (currentTicketColorIdx + 1) % color.length;
    let nextTicketColor = color[nextTicketColorIdx];
    ticketBandColor.classList.remove(currentTicketColor);
    ticketBandColor.classList.add(nextTicketColor);

    //update ticket array as well
    let ticketIdx = getTicketIdx(id);
    ticketArr[ticketIdx].color = nextTicketColor;
    updateLocalStorage();
  });

  //ticketArr
  if (ticketId == undefined) {
    ticketArr.push({ color: ticketColor, task: task ,id: id });
    updateLocalStorage();
  }
};

function getTicketIdx(id){
  for(let i=0; i<ticketArr.length; i++){
    if(ticketArr[i].id == id){
      return i;
    }
  }
}

function updateLocalStorage(){
  let stringifyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets",stringifyArr);
}