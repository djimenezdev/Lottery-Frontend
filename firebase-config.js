// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4r6VhXED2SfYBbN3QnaAX-RRozNslj2s",
    authDomain: "sayed-karim-firebase-ex.firebaseapp.com",
    projectId: "sayed-karim-firebase-ex",
    storageBucket: "sayed-karim-firebase-ex.appspot.com",
    messagingSenderId: "806016119688",
    appId: "1:806016119688:web:a17ad23c70dfa26c99c03d",
    measurementId: "G-H88VXDQPR6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export { db }
