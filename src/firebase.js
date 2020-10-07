import firebase from "firebase";

const config = {
    apiKey: "AIzaSyAeCuT71AuzFy9VZ3_on2aQxRAJxNc919E",
    authDomain: "gbvbw-e1755.firebaseapp.com",
    databaseURL: "https://gbvbw-e1755.firebaseio.com",
    projectId: "gbvbw-e1755",
    storageBucket: "gbvbw-e1755.appspot.com",
    messagingSenderId: "165377936646",
    appId: "1:165377936646:web:532a23a47000ebb734a287",
    measurementId: "G-0C6LC96KE2"
};

const firebaseApp = firebase.initializeApp(config);

const db = firebaseApp.firestore();
firebase.analytics();

export { db };
export { firebaseApp };