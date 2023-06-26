import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import {UserContextProvider} from "../context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quoted",
  description: "Share your quotes with the public",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <main className="lg:mx-20 md:mx-16">
          <UserContextProvider>
            <Navbar />
            {children}
          </UserContextProvider>
        </main>
      </body>
    </html>
  );
}
