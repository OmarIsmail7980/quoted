"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Quote from "@/components/Quote";
export default function Home() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotesRef = collection(db, "quotes");
        const querySnapshot = await getDocs(quotesRef);

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
      }
    };
    fetchData();
  }, []);

  console.log({ quotes });
  return (
    <section className="px-4">
      {quotes.map((document) => {
        return <Quote data={document} />;
      })}
    </section>
  );
}
