import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import { ProtectedRoute } from "./components/protectedRoute";
import { Home } from "./pages/Home";
import { Private } from "./pages/Private";

import { useEffect, useState } from "react";
import { Discuss } from "react-loader-spinner";

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`flex justify-center items-center h-screen ${isFetching ? 'bg-gray-500' : ''}`}>
      {isFetching && (
        <div>
          <Discuss
            visible={true}
            height="80"
            width="80"
            ariaLabel="discuss-loading"
            wrapperStyle={{}}
            wrapperClass="discuss-wrapper"
            color="#fff"
            backgroundColor="#00000"
          />
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home user={user}></Home>}></Route>
          <Route
            path="/private"
            element={
              <ProtectedRoute user={user}>
                <Private></Private>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
