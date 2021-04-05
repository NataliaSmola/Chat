const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName;

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({ author, content }) => addMessage(author, content));
socket.on('removeUser', ({ author, content }) => addMessage(author, content));

function login(event){
  event.preventDefault();
  if(!userNameInput.value){
    alert("Field is empty");
  }
  else {
    userName = userNameInput.value;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
    socket.emit('newUser', { author: userName, id: socket.id })
  }
};

function sendMessage(event){
  event.preventDefault();
  let messageContent = messageContentInput.value;
  if(!messageContent.length){
    alert("Field is empty");
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = ''
  }
};

function addMessage(author, content){
  const message = document.createElement("li");
  message.classList.add("message", "message--received");
  if(author === userName){
    message.classList.add("message--self");
  };
  if(author === 'ChatBot'){
    message.classList.add("message--chatbot");
  };
  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};


loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
