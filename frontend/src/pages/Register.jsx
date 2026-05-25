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
      console.log(error.response?.data || error.message);
    }
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;