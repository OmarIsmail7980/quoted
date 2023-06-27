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

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //order in descinding order
        const quotesRef = collection(db, "quotes");
        const querySnapshot = await getDocs(
          query(quotesRef, orderBy("createdAt", "desc"))
        );

        querySnapshot.forEach(async (document) => {
          //query the most recent info of the user
          const currentUserId =
            document._document.data.value.mapValue.fields.uid.stringValue;
          const userRef = doc(db, "users", currentUserId);
          const userSnap = await getDoc(userRef);

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
    setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));

    try {
      const docRef = doc(db, "quotes", id);
      await deleteDoc(docRef);
      alert("Successfully deleted the quote!");
    } catch (error) {
      alert(error);
    }
  };

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
          {quotes.map((quote) => (
            <Quote
              key={quote.id + data.quote.stringValue}
              data={quote}
              handleDelete={handleDelete}
            />
          ))}
        </>
      )}
    </section>
  );
}

