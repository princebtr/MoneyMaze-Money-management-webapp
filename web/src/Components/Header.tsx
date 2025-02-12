import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { AuthProvider, useAuth } from "@/utils/authContext";

export default function Component() {
  const { isLoggedIn, currentUser, logout } = useAuth();

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          MoneyMaze
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/financial">Financial</Link>
          </li>
          <li>
            <Link to="/financial_dashboard">Financial Dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard2">Dashboard</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/profile">
                  <img
                    src={currentUser?.avatarUrl || "/avatar.png"}
                    alt="Profile Avatar"
                    className="avatar"
                  />
                  {currentUser?.fullName}
                </Link>
              </li>
              <li>
                <Link to="#" onClick={logout}>
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
