import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authFailure, authStart, authSuccess } from "../redux/slice/authSlice";
import Service from "../config/servis";
import { Toast } from "../config/sweetAlert";

export default function Signin() {
    const { isLoading, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        email: "",
        password: "",
    });

    const getAuthCred = (e) => {
        setAuth({
            ...auth,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            dispatch(authStart());
            const { data } = await Service.loginAuth(auth);
            dispatch(authSuccess({ data: data.data, token: data.token }));
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            dispatch(authFailure(error?.response?.data));
            // Toast.fire({ icon: "error", title: error?.response?.data || error?.message });
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
            if (!window.location.hash) {
                window.location.hash = '#loaded';
                window.location.reload();
            }
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="h-screen w-full absolute z-10 bg-gray-100">
            <h1 className="text-center text-3xl mt-20">Hisobga kirish</h1>

            <form className="max-w-sm mx-auto my-10">
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Elektron pochta
                    </label>
                    <input
                        onChange={getAuthCred}
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Parolingiz
                    </label>
                    <input
                        onChange={getAuthCred}
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </div>

                <button
                    onClick={handleLogin}
                    type="button"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    {isLoading ? "Loading..." : "Hisobga kirish"}
                </button>
            </form>
        </div>
    );
}
