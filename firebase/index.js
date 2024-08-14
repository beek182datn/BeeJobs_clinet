import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDIyRNcgd7Hg3QvUJAER_sWGd852d0VJkM",
    authDomain: "beejobs-ee60a.firebaseapp.com",
    projectId: "beejobs-ee60a",
    storageBucket: "beejobs-ee60a.appspot.com",
    messagingSenderId: "223129974336",
    appId: "1:223129974336:web:7b699d03335911ee43d1a5",
    measurementId: "G-TD531YDLPW"
  };
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

