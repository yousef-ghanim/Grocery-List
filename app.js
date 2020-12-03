const submitBtn = document.querySelector(".submit-btn");
const input = document.getElementById("input");
const list = document.querySelector(".list");
const clearBtn = document.querySelector(".clear-btn");
const alertp = document.querySelector(".alert");




let editFlag = false;
let editElement;
let editID = "";

window.addEventListener("DOMContentLoaded", setupItems);

function addTodo(id, value){
    let text = `<article class="item" id="${id}">
        <p class="item-name">${value}</p>
        <div class="item-btns">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
    </article>`
    list.insertAdjacentHTML("beforeend", text);
    clearBtn.style.display = "block";
    // deleteBtn
    const deleteBtn = document.querySelectorAll(".delete-btn");
     deleteBtn.forEach((btn) =>{
btn.addEventListener("click", deleteItem);

     })
// editBtn
const editBtn = document.querySelectorAll(".edit-btn");
editBtn.forEach((btn) => {
    btn.addEventListener("click", editItem);
})
}

// edit item
function editItem(e){
const element = e.target.parentElement.parentElement.parentElement;
editElement = e.currentTarget.parentElement.previousElementSibling;
input.value = editElement.textContent;
 editFlag = true;
editID = element.id;
submitBtn.textContent = "Edit";
}

// delete item
function deleteItem(e){
const element = e.target.parentElement.parentElement.parentElement;
const id = element.id;
list.removeChild(element);
if (list.children.length === 0){
    clearBtn.style.display = "none";
}
warnAlert("item removed", "red");
setToDefault();
removeFromLocalStorage(id);
}

// add item
function addItem(){
 const value = input.value;
 const id = new Date().getTime().toString();
 if(value && !editFlag){
 addTodo(id, value);
warnAlert("New item was added", "green");
addToLocalStorage(id, value);
setToDefault(); 
 }else if(value && editFlag){
editElement.textContent = value;
warnAlert("Item has been edited", "green");
editLocalStorage(editID, value);
setToDefault();
 }else{

 }

}


// add alert
function warnAlert(text, color){
alertp.textContent = text;
alertp.classList.add(color);
// remove alert
setTimeout(() => {
alertp.classList.remove(color);
alertp.textContent = "";
}, 1000);
}

submitBtn.addEventListener("click", ()=>{
addItem();
})

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    addItem();
  }
});


// clear list
clearBtn.addEventListener("click", () =>{
    const items = document.querySelectorAll(".item");
    if(items.length > 0){
 items.forEach((item)=>{
        list.removeChild(item);
    }
    )}
    clearBtn.style.display = "none";
    warnAlert("Empty list", "red");
    setToDefault();
    localStorage.removeItem("list");
})

// default

function setToDefault(){
    input.value = "";
    editFlag = false;
    submitBtn.textContent = "Submit";
    editID = "";
}

// ********** LOCAL STORAGE ************
function addToLocalStorage(id, value){
 const item = {id, value}
 let itemsArr = getLocalStorage();
 itemsArr.push(item);
 localStorage.setItem("list", JSON.stringify(itemsArr));
}

function removeFromLocalStorage(id){
    let itemsArr = getLocalStorage(); 
   itemsArr = itemsArr.filter((item)=>{
        if(item.id !== id){
            return item;
        }
    })
     localStorage.setItem("list", JSON.stringify(itemsArr));
}

function editLocalStorage(id, value){
    let itemsArr = getLocalStorage();
    itemsArr = itemsArr.map((item)=>{
        if(item.id === id){
item.value = value;
        }
        return item;
    });
         localStorage.setItem("list", JSON.stringify(itemsArr));

}


function getLocalStorage(){
let itemsArr = localStorage.getItem("list");
 if(itemsArr){
    itemsArr = JSON.parse(localStorage.getItem("list"))
 }else{
     itemsArr = [];
 }   
return itemsArr;
}

// ********** SETUP ITEMS **********

function setupItems(){
    let itemsArr = getLocalStorage();
    if(itemsArr.length > 0){
itemsArr.forEach((item)=>{
        addTodo(item.id, item.value)
    })
    clearBtn.style.display = "block";
    }
    
}