  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });


    // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCtAZFeYUH6wU85tTOUUmxX57vrZgfLbxc",
    authDomain: "todolist-a56dd.firebaseapp.com",
    databaseURL: "https://todolist-a56dd.firebaseio.com",
    projectId: "todolist-a56dd",
    storageBucket: "todolist-a56dd.appspot.com",
    messagingSenderId: "285759290972",
    appId: "1:285759290972:web:1805d17eefb47f47117099"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const todoList = document.querySelector('#todo-list')
const form = document.querySelector('#add-todo-form')
const updateBtn = document.querySelector('#update')
let newTitle = ""
let updateId = null

function renderList(doc) {
  let li = document.createElement('li');
  li.className = "collection-item"
  li.setAttribute('data-id', doc.id)
  let div = document.createElement('div');
  let title = document.createElement('span')
  title.textContent = doc.data().title
  let anchor = document.createElement('a')
  anchor.href = "#modal1"
  anchor.className = "modal-trigger secondary-content"
  let editBtn = document.createElement('i')
  editBtn.className = "material-icons"
  editBtn.innerText = "edit"
  let deleteBtn = document.createElement('i')
  deleteBtn.className = "material-icons secondary-content"
  deleteBtn.innerText = "delete"
  anchor.appendChild(editBtn)
  div.appendChild(title)
  div.appendChild(deleteBtn)
  div.appendChild(anchor)
  li.appendChild(div)

  deleteBtn.addEventListener('click', e => {
    let id = e.target.parentElement.parentElement.getAttribute('data-id')
    db.collection('todo').doc(id).delete()

  })

  editBtn.addEventListener('click', e => {
    updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id')
  })

  todoList.append(li)
}
updateBtn.addEventListener('click', e => {
  newTitle = document.getElementsByName('newtitle')[0].value
  db.collection('todo').doc(updateId).update({
    title : newTitle
  })
})

form.addEventListener('submit', e => {
  e.preventDefault()
  db.collection('todo').add({
    title:form.title.value
  })
  form.title.value = ""
})


db.collection('todo').orderBy('title').onSnapshot(snapshot => {
  let changes = snapshot.docChanges()
  // console.log(changes)
  changes.forEach(change => {
    if (change.type === 'added') {
      renderList(change.doc)
    } else if (change.type === 'removed') {
      let li = todoList.querySelector(`[data-id=${change.doc.id}]`)
      todoList.removeChild(li)
    } else if (change.type === 'modified') {
      let li = todoList.querySelector(`[data-id=${change.doc.id}]`)
      li.getElementsByTagName('span')[0].textContent = newTitle
      newTitle = ''
    } else if (change.type.trim() === "") {
      return
    }
  }) 
})