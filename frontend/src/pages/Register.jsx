import { useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";



function Register() {
  const navigate=useNavigate();
  
  const {login}=useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
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
      const response = await api.post(
        "/auth/register",
      formData
    );

      // Save token and user in local storage
      login(
        response.data.user,
        response.data.token,
      )


      navigate("/");
    } catch (error) {
      alert(error.response?.data || "Registration Failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-gray-800 p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium"
          >
            Name
          </label>

          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your name"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            placeholder="Enter your email"
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;