import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Service from "./config/servis"
import { useDispatch } from "react-redux";
import { getFromLocalStorage } from "./config/localstorage";
import { useEffect } from "react";
import { authSuccess } from './redux/slice/authSlice';

function App() {
  const dispatch = useDispatch();

  const getAuthFunction = async () => {
    const { data } = await Service.getAuth();
    dispatch(authSuccess(data));
  };

  useEffect(() => {
    try {
      if (getFromLocalStorage("token")) {
        getAuthFunction();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
