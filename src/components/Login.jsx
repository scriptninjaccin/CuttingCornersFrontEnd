import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = ({ closeModal }) => {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [registerStep, setRegisterStep] = useState("start"); // start | otp-sent
  const [forgotStep, setForgotStep] = useState("request"); // request | confirm

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    signUp,
    confirmSignUp,
    signIn,
    requestPasswordReset,
    confirmPasswordReset,
  } = useAuth();
  const { setShowUserLogin } = useAppContext();

  const closeLoginModal = () => {
    if (typeof closeModal === "function") {
      closeModal();
    } else {
      setShowUserLogin(false);
    }
  };

  const switchToRegister = () => {
    setMode("register");
    setRegisterStep("start");
  };

  const switchToLogin = () => {
    setMode("login");
    setForgotStep("request");
    setRegisterStep("start");
  };

  const switchToForgot = () => {
    setMode("forgot");
    setForgotStep("request");
    setResetCode("");
    setNewPassword("");
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) return toast.error("Fill all fields");
    setLoading(true);
    const res = await signUp({ name, email, password });
    setLoading(false);

    if (res.success) {
      toast.success("OTP sent to your email");
      setRegisterStep("otp-sent");
    } else {
      toast.error(res.message);
    }
  };

  const handleConfirm = async () => {
    if (!otp) return toast.error("Enter OTP");
    setLoading(true);
    const res = await confirmSignUp({ email, code: otp });
    setLoading(false);

    if (res.success) {
      toast.success("Email verified! You can now login");
      setMode("login");
      setRegisterStep("start");
      setOtp("");
    } else {
      toast.error(res.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Fill all fields");
    setLoading(true);
    const res = await signIn({ email, password });
    setLoading(false);

    if (res.success) {
      toast.success("Logged in successfully");
      closeLoginModal();
    } else {
      toast.error(res.message);
    }
  };

  const handleSendResetCode = async () => {
    if (!email) return toast.error("Enter your email");

    setLoading(true);
    const res = await requestPasswordReset({ email });
    setLoading(false);

    if (res.success) {
      toast.success("Reset code sent to your email");
      setForgotStep("confirm");
    } else {
      toast.error(res.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email || !resetCode || !newPassword) {
      return toast.error("Fill all fields");
    }

    setLoading(true);
    const res = await confirmPasswordReset({
      email,
      code: resetCode,
      newPassword,
    });
    setLoading(false);

    if (res.success) {
      toast.success("Password reset successfully. Please login.");
      setMode("login");
      setForgotStep("request");
      setResetCode("");
      setNewPassword("");
      setPassword("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">
          {mode === "login" && "Login"}
          {mode === "register" && "Sign Up"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {mode === "register" && registerStep === "start" && (
          <>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleSignUp}
              className="w-full py-2 bg-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </>
        )}

        {mode === "register" && registerStep === "otp-sent" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleConfirm}
              className="w-full py-2 bg-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {mode === "login" && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-2 text-sm text-right">
              <span onClick={switchToForgot} className="text-blue-500 cursor-pointer">
                Forgot password?
              </span>
            </p>
          </>
        )}

        {mode === "forgot" && forgotStep === "request" && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleSendResetCode}
              className="w-full py-2 bg-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Sending code..." : "Send Reset Code"}
            </button>
          </>
        )}

        {mode === "forgot" && forgotStep === "confirm" && (
          <>
            <input
              placeholder="Reset code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleResetPassword}
              className="w-full py-2 bg-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="mt-2 text-sm text-center">
          {mode === "login" && (
            <>
              Create an account?{" "}
              <span onClick={switchToRegister} className="text-blue-500 cursor-pointer">
                Sign Up
              </span>
            </>
          )}

          {mode === "register" && (
            <>
              Already have an account?{" "}
              <span onClick={switchToLogin} className="text-blue-500 cursor-pointer">
                Login
              </span>
            </>
          )}

          {mode === "forgot" && (
            <>
              Back to{" "}
              <span onClick={switchToLogin} className="text-blue-500 cursor-pointer">
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
