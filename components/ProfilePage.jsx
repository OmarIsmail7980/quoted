"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/UserContext";
import { db, storage } from "@/firebase/firebaseConfig";
import Image from "next/image";
import { getDoc, setDoc, doc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loading from "./Loading";

const ProfilePage = () => {
  const { user } = useAuth();
  console.log(user);
  const [userProfile, setUserProfile] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      if (user) {
        console.log({ user });
        const userId = user.uid;
        const userRef = doc(collection(db, "users"), userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({ ...userData });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const imageFile = e.target.files[0];
    setUploadedImage(imageFile);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      // Keep the existing profile image URL if no new image is selected
      let newProfileImageURL = userProfile.photoURL;

      if (uploadedImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, uploadedImage);
        newProfileImageURL = await getDownloadURL(storageRef);

        setUserProfile((value) => {
          return { ...value, photoURL: newProfileImageURL };
        });
      }

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        displayName: userProfile.displayName,
        email: userProfile.email,
        photoURL: newProfileImageURL,
      });

      alert("User document created successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  console.log({ userProfile });
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div>
          <h1>Profile Page</h1>

          {userProfile.photoURL && (
            <Image
              src={userProfile.photoURL}
              alt="user"
              width={37}
              height={37}
              className="object-contain rounded-full"
              onClick={() => {
                setToggleDropDown((value) => !value);
              }}
            />
          )}

          <form onSubmit={handleSaveProfile}>
            <input
              type="text"
              placeholder="Full name"
              value={userProfile.displayName || ""}
              onChange={(e) =>
                setUserProfile((profile) => ({
                  ...profile,
                  displayName: e.target.value,
                }))
              }
            />

            <input
              type="text"
              placeholder="Email"
              value={userProfile.email || ""}
              onChange={(e) =>
                setUserProfile((profile) => ({
                  ...profile,
                  email: e.target.value,
                }))
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />

            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
