import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; 
import { writeUserData } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

export const Home = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const navigate = useNavigate(); // Используем хук useNavigate для программного перехода

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = () => {
    if (!email || !password) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        writeUserData(user.uid, "New User", email, "");
        navigate("/private", { state: { uid: user.uid } }); // Программный переход на страницу Private
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/private", { state: { uid: user.uid } }); // Программный переход на страницу Private
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  if (user) {
    writeUserData(user.uid, "New User", user.email, "");
    return <Navigate to="/private" state={{ uid: user.uid }} />;
  }
  return (
    <section>
      <div className="absolute top-[40%] left-[40%] right-[60%] border rounded-lg">
        <form className="p-4 m-2 w-[500px] h-[300px]">
          <div className="font-serif text-3xl border rounded-md w-[120px] p-1 text-teal-100 bg-slate-600">
            {isSignUpActive && <legend>Sign Up</legend>}
            {!isSignUpActive && <legend>Sign In</legend>}
          </div>
          <fieldset className="flex justify-center">
            <ul className="w-full py-4">
              <li className="w-[200px]">
                <label htmlFor="email" className="text-xl font-serif ">
                  Email
                </label>
                <input type="text" id="email" onChange={handleEmailChange} 
                className="w-[200px] border rounded-lg p-1 text-lg" />
              </li>
              <li className="w-[200px]">
                <label htmlFor="password" className="text-xl font-serif text-gra">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={handlePasswordChange} 
                  className="w-[200px] border rounded-lg p-1 text-lg"
                />
              </li>
            </ul>
          </fieldset>{" "}
          <div className="w-full">
            {isSignUpActive && (
              <button
                className="p-2 border rounded-lg w-[200px] h-[50px]"
                type="button"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            )}
            {!isSignUpActive && (
              <button
                className="p-2 border rounded-lg w-200px"
                type="button"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}{" "}
          </div>
          {isSignUpActive && <a onClick={handleMethodChange}>Login</a>}
          {!isSignUpActive && (
            <a onClick={handleMethodChange}>Create an account</a>
          )}
        </form>
      </div>
    </section>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};
