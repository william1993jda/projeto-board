import firebase from "firebase";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2oV0S3ptasaTjgQb9TcWWANBUPALYvvU",
  authDomain: "boardapp-c326b.firebaseapp.com",
  projectId: "boardapp-c326b",
  storageBucket: "boardapp-c326b.appspot.com",
  messagingSenderId: "557506002421",
  appId: "1:557506002421:web:7b83ac2935557a2ced74bc",
  measurementId: "G-M04R70HMXP"
};

// Initialize Firebase

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export default firebase