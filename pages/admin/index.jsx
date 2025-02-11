import "../../app/globals.css"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Check, X, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationState, setValidationState] = useState({
    username: {
      minLength: false,
      noSpaces: false,
      alphanumeric: false,
    },
    password: {
      minLength: false,
      hasNumber: false,
      hasSpecial: false,
      hasUppercase: false,
    },
    touched: {
      username: false,
      password: false,
    },
  });

  const validateField = (name, value) => {
    if (name === "username") {
      return {
        minLength: value.length >= 7,
        noSpaces: !/\s/.test(value),
        alphanumeric: /^[a-zA-Z0-9]+$/.test(value),
      };
    } else if (name === "password") {
      return {
        minLength: value.length >= 7,
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
      };
    }
    return {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationState((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      touched: { ...prev.touched, [name]: true },
    }));
  };

  const isFormValid = () => {
    const usernameValid = Object.values(validationState.username).every(Boolean);
    const passwordValid = Object.values(validationState.password).every(Boolean);
    return usernameValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const ValidationIcon = ({ valid }) =>
    valid ? (
      <Check className="validation-icon valid" />
    ) : (
      <X className="validation-icon invalid" />
    );

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group slide-in">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${
                  validationState.touched.username &&
                  !Object.values(validationState.username).every(Boolean)
                    ? "invalid"
                    : ""
                }`}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            {validationState.touched.username && (
              <div className="validation-list">
                {Object.entries(validationState.username).map(([key, valid]) => (
                  <div key={key} className="validation-item fade-in">
                    <ValidationIcon valid={valid} />
                    <span className={valid ? "valid" : "invalid"}>
                      {key === "minLength" && "At least 7 characters"}
                      {key === "noSpaces" && "No spaces allowed"}
                      {key === "alphanumeric" && "Only letters and numbers"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group slide-in">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${
                  validationState.touched.password &&
                  !Object.values(validationState.password).every(Boolean)
                    ? "invalid"
                    : ""
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="icon" />
                ) : (
                  <Eye className="icon" />
                )}
              </button>
            </div>
            {validationState.touched.password && (
              <div className="validation-list">
                {Object.entries(validationState.password).map(([key, valid]) => (
                  <div key={key} className="validation-item fade-in">
                    <ValidationIcon valid={valid} />
                    <span className={valid ? "valid" : "invalid"}>
                      {key === "minLength" && "At least 7 characters"}
                      {key === "hasNumber" && "Contains a number"}
                      {key === "hasSpecial" && "Contains a special character"}
                      {key === "hasUppercase" && "Contains an uppercase letter"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`submit-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <div className="loading-wrapper">
                <div className="loading-spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;