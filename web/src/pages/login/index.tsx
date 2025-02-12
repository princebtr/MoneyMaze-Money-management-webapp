import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginService } from "@/services";
import { setTokenAndRedirect } from "../common";
import { showToast } from "@/utils/toast";
import "./style.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = { email, password };

    const { status, cls, msg, payload } = await loginService(input);
    showToast(msg, cls);

    if (status) {
      setTimeout(() => {
        setTokenAndRedirect(payload);
      }, 2000);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="text-secondary text-center">
          Welcome back! Login to your account to access the dashboard.
        </p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
        <Link className="forgot-password-link" to="/forget-password">
          Forgot Password?
        </Link>
      </form>
    </div>
  );
};

const LoginPage = () => {
  return (
    <main className="login-page">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
