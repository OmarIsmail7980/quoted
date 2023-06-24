"use client";
const { createContext, useState, useEffect, useContext } = require("react");
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig/firebaseConfig";

const UserContext = createContext(null);
export const useAuth = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log(userSnap._document.data.value.mapValue.fields.photoURL);
        console.log(userSnap._document.data.value.mapValue.fields);
        setUser({
          ...currentUser,
          photoURL:
            userSnap._document.data.value.mapValue.fields.photoURL.stringValue,
        });
      } else {
        setUser(currentUser);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const currentUser = auth.currentUser;
      console.log({ currentUser });
      if (currentUser) {
        await createUserDocument(currentUser);
      }
    } catch (error) {
      alert(error);
    }
  };

  const createUserDocument = async (user) => {
    console.log("hello buddy");
    console.log(user.uid);

    const docRef = doc(db, "users", user.uid);

    try {
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
        console.log("User document created successfully");
      } else {
        console.log("User document already exists");
      }
    } catch (error) {
      console.log("Creation error", error);
    }
  };

  const googleSignOut = () => {
    signOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, googleSignIn, googleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};
