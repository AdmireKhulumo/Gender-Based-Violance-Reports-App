import firebase from "firebase";

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const firebaseApp = firebase.initializeApp(config);

const db = firebaseApp.firestore();
firebase.analytics();

export { db };
export { firebaseApp };
