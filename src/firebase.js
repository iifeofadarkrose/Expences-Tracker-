// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  databaseURL: import.meta.env.DATA_BASE_URL,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING,
  appId: import.meta.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Функция для записи данных пользователя в базу данных
function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  const reference = ref(db, "users/" + userId);

  set(reference, {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}

export { app, auth, writeUserData };