import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
  const { loading, handleLogin, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await handleLogin({ email, password });
      if (success) {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="Password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="Password"
              name="Password"
              placeholder="Enter Password"
              required
            />
          </div>

          <button className="button primary-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
