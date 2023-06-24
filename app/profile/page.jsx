"use client"
import ProfilePage from "@/components/ProfilePage";
// import { useRouter } from "next/router";
import { useAuth } from "@/context/UserContext";

const Profile = () => {
  // const router = useRouter();
  const { user } = useAuth();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/");
  //   }
  // }, [user, router]);

  // if (!user) {
  //   return null; // You can display a loading spinner or a message here
  // }

  return (
    <section>
      <ProfilePage/>
    </section>
  );
};

export default Profile;
