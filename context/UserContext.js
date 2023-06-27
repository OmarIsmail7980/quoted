"use client";
import { createContext, useState, useEffect, useContext } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const UserContext = createContext(null);
export const useAuth = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      let userSnap;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        userSnap = await getDoc(userRef);
      }

      if (currentUser && userSnap.exists()) {
        setUser({
          ...currentUser,
          photoURL: userSnap.data().photoURL,
          displayName: userSnap.data().displayName,
          email: userSnap.data().email,
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
      if (currentUser) {
        await createUserDocument(currentUser);
      }
    } catch (error) {
      alert(error);
    }
  };

  const createUserDocument = async (user) => {
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

  const setProfilePhoto = (URL) => {
    setUser((currValues) => ({ ...currValues, photoURL: URL }));
  };

  return (
    <UserContext.Provider
      value={{ user, googleSignIn, googleSignOut, setProfilePhoto }}
    >
      {children}
    </UserContext.Provider>
  );
};
