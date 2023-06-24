import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: `${process.env.API_KEY}`,
  // authDomain: `${process.env.AUTH_DOMAIN}`,
  // projectId: `${process.env.PROJECT_ID}`,
  // storageBucket: `${process.env.STORAGE_BUCKET}`,
  // messagingSenderId: `${process.env.MESSAGING_SENDER_ID}`,
  // appId: `${process.env.APP_ID}`,
  apiKey: "AIzaSyAQchEmRwq6Tfgm2fsnYd9Gfys56pz7I04",
  authDomain: "quoted-df896.firebaseapp.com",
  projectId: "quoted-df896",
  storageBucket: "quoted-df896.appspot.com",
  messagingSenderId: "637022443098",
  appId: "1:637022443098:web:0c861b8e310f4776f76a63",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export const storage = getStorage(app);
