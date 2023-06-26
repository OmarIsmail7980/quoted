"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../context/UserContext";
import SigninBox from "./SigninBox";

const Navbar = () => {
  const { googleSignOut, user } = useAuth();
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [signinToggle, setSigninToggle] = useState(false);

  console.log({ user });

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setToggleDropDown(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex justify-between items-center w-full mb-16 pt-3 px-5">
      <Link href="/" className="flex flex-center">
        <h1 className="font-bold text-[28px]">Quoted</h1>
      </Link>

      {/* mobile navigation */}
      <div className="sm:hidden flex relative">
        {user?.displayName ? (
          <div className="flex">
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
              <Image
                src={`${user.photoURL}`}
                alt="user"
                width={37}
                height={37}
                className="object-cover w-full h-full"
                onClick={() => {
                  setToggleDropDown((value) => !value);
                }}
              />
            </div>

            {toggleDropDown && (
              <div
                className="absolute right-0 top-full mt-3 w-full p-5 rounded-lg bg-white min-w-[210px] 
            flex flex-col gap-2 justify-start items-end border border-gray-300"
              >
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => {
                    setToggleDropDown(false);
                  }}
                >
                  My Profile
                </Link>

                <Link
                  href="/create-quote"
                  className="dropdown_link"
                  onClick={() => {
                    setToggleDropDown(false);
                  }}
                >
                  Create Quote
                </Link>

                <button
                  type="button"
                  className="mt-5 w-full black_btn"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              className="w-full black_btn px-5"
              onClick={() => setSigninToggle(true)}
            >
              Sign In
            </button>
          </>
        )}
      </div>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        {user?.displayName ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-quote" className="black_btn">
              Create Post
            </Link>

            <button
              type="button"
              className="outline_btn"
              onClick={handleSignOut}
            >
              Sign Out
            </button>

            <Link href="/profile">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <Image
                  src={`${user.photoURL}`}
                  alt="user"
                  width={37}
                  height={37}
                  className="object-cover w-full h-full"
                  onClick={() => {
                    setToggleDropDown((value) => !value);
                  }}
                />
              </div>
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="w-full black_btn"
              onClick={() => setSigninToggle(true)}
            >
              Sign In
            </button>
          </>
        )}
      </div>

      {signinToggle && <SigninBox toggle={setSigninToggle} />}
    </nav>
  );
};

export default Navbar;
