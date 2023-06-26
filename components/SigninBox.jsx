
const SigninBox = ({handleSignIn, toggle}) => {
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
          <GoogleButton
            className="cursor-pointer hover:shadow-lg"
            onClick={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
}

export default SigninBox
