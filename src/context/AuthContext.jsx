import React, { createContext, useContext, useEffect, useState } from "react";
import {
  confirmSignUp as amplifyConfirmSignUp,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from "aws-amplify/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cognitoUser = await getCurrentUser();
        setUser(cognitoUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signUp = async ({ name, email, password }) => {
    try {
      const data = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error?.message || "Sign up failed" };
    }
  };

  const confirmSignUp = async ({ email, code }) => {
    try {
      await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Confirmation failed",
      };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const result = await amplifySignIn({ username: email, password });
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser, result };
    } catch (error) {
      return { success: false, message: error?.message || "Login failed" };
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, signUp, confirmSignUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
