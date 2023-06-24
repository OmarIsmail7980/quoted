"use client";

import Loading from "@/components/Loading";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig/firebaseConfig";
import { useAuth } from "@/context/UserContext";

const page = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", quote: "" });
  const [isPosting, setIsPosting] = useState(false);

  const handleChange = (event) => {
    setForm((currForm) => {
      return { ...currForm, [event.target.name]: event.target.value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPosting(true);
    try {
      const collectionRef = collection(db, "quotes");
      await addDoc(collectionRef, {
        uid: user.uid,
        quote: form.quote,
        author: form.name,
        photo: user.photoURL,
        name: user.displayName,
        createdAt: new Date(),
      });
      console.log("quote has been saved!");
    } catch (error) {
      alert(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <section className="px-4">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create a Quote
        </h1>
        <p className="mt-2 text-[#66e75] text-[16px] max-w-[500px]">
          Share your quote with the public
        </p>
      </div>

      <div className="mt-5">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="block text-normal font-medium text-gray-900">
            Author's Name
          </label>
          <input
            type="text"
            required={true}
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-50 border 
        border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-primary 
        focus:border-primary outline-none block 
        w-full p-3"
          ></input>

          <label className="block text-normal font-medium text-gray-900">
            Quote
          </label>
          <textarea
            required={true}
            name="quote"
            minLength="50"
            maxLength="900"
            cols="0"
            rows="7"
            value={form.quote}
            onChange={handleChange}
            className="bg-gray-50 border 
        border-gray-300 text-gray-900 
        text-sm rounded-lg focus:ring-primary 
        focus:border-primary outline-none block 
        w-full p-3"
          ></textarea>

          <button
            type="submit"
            className="text-white bg-black font-medium 
            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 
            text-center mt-5"
          >
            {isPosting ? <Loading /> : <>Share</>}
          </button>
        </form>
      </div>
    </section>
  );
};

export default page;
