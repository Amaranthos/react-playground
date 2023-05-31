import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBSVCS1PAp_0zveZxv6CqMlIOw4r_VnJxY",
  authDomain: "playground-dnd.firebaseapp.com",
  databaseURL: "https://playground-dnd.firebaseio.com",
  projectId: "playground-dnd",
  storageBucket: "playground-dnd.appspot.com",
  messagingSenderId: "112816296150",
  appId: "1:112816296150:web:a33f1de145bb648ba8b977"
};

export const fire = firebase.initializeApp(config);
