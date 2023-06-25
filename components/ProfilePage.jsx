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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  };

  const changeMade =
    userProfile.displayName !== user.displayName ||
    userProfile.photoURL !== user.photoURL ||
    userProfile.email !== user.email;

  console.log({ changeMade });

  console.log({ userProfile });
  return (
    <>
      {isLoading ? (
        <section className="flex justify-center items-center">
          <Loading />
        </section>
      ) : (
        <section className="flex flex-col px-4">
          {userProfile.photoURL && (
            <div className="w-full flex justify-center">
              <div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-10">
                <Image
                  src={userProfile.photoURL}
                  alt="user"
                  width={37}
                  height={37}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col gap-2 mb-3">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full name"
                value={userProfile.displayName || ""}
                className="bg-gray-50 border 
        border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-primary 
        focus:border-primary outline-none block 
        w-full p-3"
                onChange={(e) =>
                  setUserProfile((profile) => ({
                    ...profile,
                    displayName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                className="bg-gray-50 border 
        border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-primary 
        focus:border-primary outline-none block 
        w-full p-3"
                value={userProfile.email || ""}
                onChange={(e) =>
                  setUserProfile((profile) => ({
                    ...profile,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            <input
              type="file"
              accept="image/*"
              className="mb-3"
              onChange={handleProfileImageChange}
            />

            {changeMade && (
              <button
                className="text-white bg-black font-medium 
            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 
            text-center mt-5"
                type="submit"
              >
                {isSaving ? <Loading /> : <>Save</>}
              </button>
            )}
          </form>
        </section>
      )}
    </>
  );
};

export default ProfilePage;
