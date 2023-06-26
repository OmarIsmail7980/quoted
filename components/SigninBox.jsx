import { useAuth } from "@/context/UserContext";
import GoogleButton from "react-google-button";

const SigninBox = ({toggle }) => {

    const { googleSignIn } = useAuth();

    const signIn = async () => {
      try {
        await googleSignIn();
      } catch (error) {
        console.log(error);
      }finally{
        toggle(false);
      }
    };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  mx-2">
      <div className="fixed inset-0 opacity-75"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10 relative">
        <span
          className="absolute top-0 right-2 cursor-pointer"
          onClick={() => toggle(false)}
        >
          &#128473;
        </span>
        <h2 className="text-lg mb-4 text-center">Sign In</h2>
        <div className="flex justify-center">
          <div onClick={signIn}>
            <GoogleButton className="cursor-pointer hover:shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

SigninBox.defaultProps = {
  handleSignIn: () => {},
  toggle: () => {},
};

export default SigninBox;
