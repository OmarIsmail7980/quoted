"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import Quote from "@/components/Quote";
import Loading from "@/components/Loading";
import { useAuth } from "../context/UserContext";

export default function Home() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotesRef = collection(db, "quotes");
        const querySnapshot = await getDocs(
          query(quotesRef, orderBy("createdAt", "desc"))
        );

        console.log({ querySnapshot });
        querySnapshot.forEach(async (document) => {
          //query the most recent info of the user
          const currentUserId =
            document._document.data.value.mapValue.fields.uid.stringValue;
          const userRef = doc(db, "users", currentUserId);
          const userSnap = await getDoc(userRef);

          console.log({ doc: document });
          setQuotes((currVal) => [
            ...currVal,
            {
              ...document._document.data.value.mapValue.fields,
              id: document.id,
              photo:
                userSnap._document.data.value.mapValue.fields.photoURL
                  .stringValue,
              name: userSnap._document.data.value.mapValue.fields.displayName
                .stringValue,
            },
          ]);
        });
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setQuotes((currQuotes) => {
      const newQuotes = [];
      for (let doc of currQuotes) {
        if (doc.id !== id) {
          newQuotes.push(doc);
        }
      }
      return newQuotes;
    });

    try {
      const docRef = doc(db, "quotes", id);
      await deleteDoc(docRef);
      alert("successfully deleted the quote!");
    } catch (error) {
      alert(error);
    }
  };


  console.log({ quotes });
  console.log({ user });
  return (
    <section className="px-4 flex flex-col mb-10">
      <h1 className="text-center text-[28px] font-medium mb-5 lg:mb-10 md:mb-8">
        Welcome to Quoted, a platform where you can share and discover inspiring
        quotes!
      </h1>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {quotes.map((document) => {
            return <Quote data={document} handleDelete={handleDelete}/>;
          })}
        </>
      )}
    </section>
  );
}
