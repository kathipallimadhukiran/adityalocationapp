// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Add this for Firestore support

const firebaseConfig = {
  apiKey: "AIzaSyDzSZEvDMQ9w7oI5vo-JycaZoGSykbl6fQ",
  authDomain: "testing-auth-543a4.firebaseapp.com",
  projectId: "testing-auth-543a4",
  storageBucket: "testing-auth-543a4.appspot.com", // corrected domain
  messagingSenderId: "398260959798",
  appId: "1:398260959798:web:69185039e28bee1ebff697"
};

// Initialize only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firestore instance from compat SDK
const db = firebase.firestore();

export { firebase, db };
