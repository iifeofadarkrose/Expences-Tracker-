import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKQ24fuxn6VfYFPyCADZhuqL9YvhIAvkg",
  authDomain: "expences-tracker-f2d0a.firebaseapp.com",
  databaseURL: "https://expences-tracker-f2d0a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expences-tracker-f2d0a",
  storageBucket: "expences-tracker-f2d0a.appspot.com",
  messagingSenderId: "877273857368",
  appId: "1:877273857368:web:e59c380171b81ad263b92d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
export const db2 = getFirestore(app)
function writeUserData(userId, name, email, imageUrl) {
  const reference = ref(db, "users/" + userId);

  set(reference, {
    username: name,
    email: email,
    profile_picture: imageUrl,
  })
    .then(() => {
      console.log("User data written successfully");
    })
    .catch((error) => {
      console.error("Error writing user data:", error);
    });
}

async function getUserData(userId) {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available for this user");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export { app, auth, writeUserData, getUserData };

// Слушаем изменения в аутентификации пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Если пользователь вошел в систему, записываем данные в базу данных
    writeUserData(user.uid, "New User", user.email, "");
  }
});