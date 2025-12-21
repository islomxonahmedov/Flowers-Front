import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Service from "./config/servis";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authSuccess, authFailure } from './redux/slice/authSlice';
import { getFromLocalStorage } from "./config/localstorage";
import FlowersInfo from "./pages/FlowersSee";
import Signin from "./pages/Signin";
import { Toast } from "./config/sweetAlert";
import Basket from "./pages/Basket";
import OrdersPage from "./pages/Orders";

function App() {
  const { auth } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getAuthFunction = async () => {
    try {
      const { data } = await Service.getAuth();
      dispatch(authSuccess({ data, token: getFromLocalStorage("token") }));
    } catch (error) {
      dispatch(authFailure(error?.response?.data));
      navigate('/signin');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (getFromLocalStorage("token")) {
        await getAuthFunction();
      } else {
        navigate('/signin');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const addToBasketFunction = async (flowerId) => {
    if (getFromLocalStorage("token")) {
      if (!auth?.data?._id) {
        console.log("User ID is undefined");
        return;
      }
      try {
        const { data } = await Service.addToBasket(auth?.data?._id, flowerId);
        Toast.fire({ icon: "success", title: data?.message });
        await getAuthFunction();
      } catch (error) {
        console.log(error.message);
        Toast.fire({ icon: "warning", title: error?.response?.data || error.message });
      }
    } else {
      navigate("/signin");
    }
  };
  const toggleLikeFunction = async (flowerId) => {
    if (getFromLocalStorage("token")) {
      if (!auth?.data?._id) {
        console.log("User ID is undefined");
        return;
      }
  
      const likedFlowers = auth?.data?.likedFlowers || [];
      const isLiked = likedFlowers.includes(flowerId);
  
      try {
        const { data } = isLiked
          ? await Service.removeFromLike(auth?.data?._id, flowerId)
          : await Service.addToLike(auth?.data?._id, flowerId);
  
        Toast.fire({ icon: "success", title: data?.message });
        await getAuthFunction();
      } catch (error) {
        console.log(error.message);
        Toast.fire({ icon: "warning", title: error?.response?.data || error.message });
      }
    } else {
      navigate("/signin");
    }
  };
  
  

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home addToBasketFunction={addToBasketFunction} toggleLikeFunction={toggleLikeFunction} />} />
        <Route path="/flowers/:id" element={<FlowersInfo addToBasketFunction={addToBasketFunction} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/order_user" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}

export default App;
