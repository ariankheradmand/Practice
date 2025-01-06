import "../../app/globals.css";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import BarLoader from "react-spinners/BarLoader";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({
    invalid: false,
    success: false,
    usernameValid: false,
    passwordValid: false,
  });
  const router = useRouter();

  // Updates form data and resets status flags
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus((prev) => ({ ...prev, invalid: false, success: false }));
  }, []);

  // Validates username and password on change
  useEffect(() => {
    setFormStatus((prev) => ({
      ...prev,
      usernameValid: formData.username.length >= 7,
      passwordValid: formData.password.length >= 7,
    }));
  }, [formData]);

  // Handles login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus((prev) => ({ ...prev, invalid: false, success: false }));

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus((prev) => ({ ...prev, success: true }));
        setTimeout(() => router.push("/admin/dashboard"), 5000);
      } else {
        setFormData((prev) => ({ ...prev, username: "", password: ""}));
        setFormStatus((prev) => ({ ...prev, invalid: true }));
        
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormStatus((prev) => ({ ...prev, invalid: true }));
    } finally {
      setLoading(false);
    }
  };

  // Utility to determine input border color
  const getInputBorderClass = (isValid) =>
    isValid ? "border-green-400" : "border-red-400";

  // Button styles based on status
  const getButtonClass = () => {
    if (loading) return "bg-gray-400 cursor-not-allowed";
    if (formStatus.success) return "bg-green-400";
    return "bg-blue-500 hover:bg-blue-600";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-500 w-full">
      <form
        onSubmit={handleLogin}
        className={`flex flex-col items-center justify-center ${formStatus.success && "border-green-400 border-2"} gap-4 bg-gradient-to-br from-white to-gray-300 p-6 rounded-lg shadow-lg w-96`}
      >
        <h1 className="text-xl font-bold text-gray-700">Welcome</h1>

        {/* Username Input */}
        <input
          type="text"
          name="username"
          className={`text-black py-2 px-3 border rounded-lg outline-none w-full focus:ring focus:ring-blue-300 transition-all ${getInputBorderClass(
            formStatus.usernameValid
          )}`}
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          className={`text-black py-2 px-3 border rounded-lg outline-none w-full focus:ring focus:ring-blue-300 transition-all ${getInputBorderClass(
            formStatus.passwordValid
          )}`}
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />

        {/* Validation Feedback */}
        <div className="w-full border border-dashed rounded-lg p-4">
          {[{ label: "Username", isValid: formStatus.usernameValid }, { label: "Password", isValid: formStatus.passwordValid }].map(
            ({ label, isValid }, index) => (
              <div key={index} className="flex items-center gap-2 pt-2">
                <Image
                  src={isValid ? "/Check.svg" : "/False.svg"}
                  alt={isValid ? "Valid" : "Invalid"}
                  width={20}
                  height={20}
                />
                <p className={`text-sm ${isValid ? "text-green-600" : "text-red-500 animate__animated animate__headShake"}`}>
                  {label} must be at least 7 characters
                </p>
              </div>
            )
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={!formStatus.usernameValid || !formStatus.passwordValid || loading}
          type="submit"
          className={` rounded-lg w-full text-white overflow-hidden ${getButtonClass()}`}
        >
          {loading ? (
            <BarLoader height={15} width={350} color="#fff" />
          ) : formStatus.success ? (
            <p className="py-2">Success</p>
          ) : (
            <p className="py-2">Login</p>
          )}
        </button>

        {/* Error Message */}
        {formStatus.invalid && <p className="text-sm text-red-500">Invalid username or password</p>}
      </form>
    </div>
  );
};

export default Login;
