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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
    setError("");
  };

  const handleSignUp = () => {
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        writeUserData(user.uid, "New User", email, "");
        navigate("/private", { state: { uid: user.uid } });
      })
      .catch((error) => {
        setError(getAuthErrorMessage(error.code));
      });
  };

  const handleSignIn = () => {
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/private", { state: { uid: user.uid } });
      })
      .catch((error) => {
        setError(getAuthErrorMessage(error.code));
      });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError("");
    setError("");
  };
  
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError("");
    setError("");
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    setEmailError(validateEmail(email) ? "" : "Please enter a valid email address.");
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    setPasswordError(validatePassword(password) ? "" : "Password must be at least 6 characters long.");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "User not found. Please check your email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      default:
        return "Email or Password is wrong. Please try again.";
    }
  };

  if (user) {
    writeUserData(user.uid, "New User", user.email, "");
    return <Navigate to="/private" state={{ uid: user.uid }} />;
  }

  return (
    <section className="flex justify-center items-center border-sm rounded-xl p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-center text-3xl font-bold mb-4">
          {isSignUpActive ? "Sign Up" : "Sign In"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              emailError && !emailFocused ? "border-red-500" : "border-sm"
            } rounded-xl border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="text"
            placeholder="Email"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            onFocus={() => setEmailFocused(true)}
          />
          {emailError && !emailFocused && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`shadow appearance-none border ${
              passwordError && !passwordFocused ? "border-red-500" : "border-sm"
            } rounded-xl border-black w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            onFocus={() => setPasswordFocused(true)}
          />
          {passwordError && !passwordFocused && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4 cursor-pointer"
            type="button"
            onClick={isSignUpActive ? handleSignUp : handleSignIn}
          >
            {isSignUpActive ? "Sign Up" : "Sign In"}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
            onClick={handleMethodChange}
          >
            {isSignUpActive ? "Sign In instead" : "Sign Up instead"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </div>
    </section>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};
