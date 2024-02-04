// script.js

// Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH8B4qL8mk7qyFRE93eZ85fUOhJm0ebco",
  authDomain: "chat-app-67175.firebaseapp.com",
  databaseURL: "https://chat-app-67175-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-67175",
  storageBucket: "chat-app-67175.appspot.com",
  messagingSenderId: "445040544924",
  appId: "1:445040544924:web:bb42bc3c8fbaead93bb159",
  measurementId: "G-QJ78WNBCVR"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const database = firebase.database();
  
  // Check if the user is already authenticated
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('username').textContent = user.displayName;
      loadMessages();
    } else {
      window.location.href = 'login.html'; // Redirect to login page if not authenticated
    }
  });
  
  function loadMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const messagesRef = database.ref('messages');
  
    messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      displayMessage(message);
    });
  }
  
  function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
  
    if (message.image) {
      const imageElement = document.createElement('img');
      imageElement.src = message.image;
      messageElement.appendChild(imageElement);
    } else {
      messageElement.textContent = message.text;
    }
  
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('fileInput');
  
    const user = auth.currentUser;
    const messagesRef = database.ref('messages');
  
    if (messageInput.value.trim() !== '' || fileInput.files.length > 0) {
      const newMessageRef = messagesRef.push();
      const timestamp = firebase.database.ServerValue.TIMESTAMP;
  
      const message = {
        uid: user.uid,
        displayName: user.displayName,
        timestamp,
        text: messageInput.value.trim(),
        image: null
      };
  
      if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const storageRef = firebase.storage().ref(`images/${timestamp}_${imageFile.name}`);
        
        storageRef.put(imageFile).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            message.image = url;
            newMessageRef.set(message);
          });
        });
      } else {
        newMessageRef.set(message);
      }
  
      messageInput.value = '';
      fileInput.value = '';
    }
  }
  
  function signOut() {
    auth.signOut().then(() => {
      window.location.href = 'login.html'; // Redirect to login page after sign out
    }).catch(error => {
      console.error(error.message);
    });
  }
  