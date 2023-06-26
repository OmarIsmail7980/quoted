"use client"
import {useEffect} from "react";
import ProfilePage from "@/components/ProfilePage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/", undefined);
    }
  }, [user]);

  return (
    <section>
      <ProfilePage/>
    </section>
  );
};

export default Profile;
