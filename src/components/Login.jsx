import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = ({ closeModal }) => {
  const [state, setState] = useState("login"); // 'login' or 'register'
  const [step, setStep] = useState("start"); // 'start' -> 'otp-sent' -> 'verified'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, confirmSignUp, signIn } = useAuth();
  const { setShowUserLogin } = useAppContext();

  const handleSignUp = async () => {
    if (!name || !email || !password) return toast.error("Fill all fields");
    setLoading(true);
    const res = await signUp({ name, email, password });
    setLoading(false);

    if (res.success) {
      toast.success("OTP sent to your email");
      setStep("otp-sent");
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
      setStep("verified");
      setState("login");
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
      if (typeof closeModal === "function") {
        closeModal();
      } else {
        setShowUserLogin(false);
      }
    } else {
      toast.error(res.message);
    }
  };

  const switchToRegister = () => {
    setState("register");
    setStep("start");
  };

  const switchToLogin = () => {
    setState("login");
    setStep("start");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">
          {state === "login" ? "Login" : "Sign Up"}
        </h2>

        {state === "register" && step === "start" && (
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

        {state === "register" && step === "otp-sent" && (
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

        {state === "login" && (
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
          </>
        )}

        <p className="mt-2 text-sm text-center">
          {state === "login" ? (
            <>
              Create an account?{" "}
              <span onClick={switchToRegister} className="text-blue-500 cursor-pointer">
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
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
