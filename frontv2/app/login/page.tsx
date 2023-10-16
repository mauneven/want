"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import endpoints from "../connections/enpoints/endpoints";
import "./login.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin ? endpoints.login : endpoints.register;
    const data = {
      email,
      password,
      ...(isLogin ? {} : { firstName, lastName, phone, birthdate }),
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (response.ok) {
      router.push("/");
    } else {
      const responseData = await response.json();
      setError(responseData.error || "Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="div-input">
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="div-input">
          <input
            placeholder="Password"
            type="password"
            className="form-input"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <>
            <div className="div-input">
              <input
                type="text"
                placeholder="First Name"
                className="form-input"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="div-input">
              <input
                type="text"
                placeholder="Last Name"
                className="form-input"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div  className="div-input">
              <input
                type="tel"
                placeholder="Phone"
                className="form-input"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div  className="div-input">
              <input
                placeholder="Birthdate"
                type="date"
                className="form-input"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
          </>
        )}
        {error && <div className="alert">{error}</div>}
        <button type="submit" className="submit-btn">
          {isLogin ? "Login" : "Register"}
        </button>
        <button type="button" onClick={toggleForm} className="toggle-btn">
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
