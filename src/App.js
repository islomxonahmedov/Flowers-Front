import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Service from "./config/servis";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authSuccess } from './redux/slice/authSlice';
import { getFromLocalStorage } from "./config/localstorage";

function App() {
  const dispatch = useDispatch();

  const getAuthFunction = async () => {
    try {
      const { data } = await Service.getAuth();
      dispatch(authSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = getFromLocalStorage("token");
    if (token) {
      getAuthFunction();
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
