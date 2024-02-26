import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATA_BASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
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