import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const {login} =useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      // Save token and user in local storage
      login (
        response.data.user,
        response.data.token,
      )

      navigate("/");
    } catch (error) {
        const errorData = error.response?.data;

        if (errorData?.message) {
          alert(errorData.message);
        } else if (errorData?.errors?.[0]?.msg) {
          alert(errorData.errors[0].msg);
        } else {
          alert("Login Failed");
        }
    }
  }
  return (
    <div className="max-w-md mx-auto mt-16 bg-gray-800 p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
