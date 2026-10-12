"use client";

import React, { createContext, useContext } from "react";
import { UserProfile } from "@/types/exam";

interface AuthContextType {
  user: UserProfile;
  loading: boolean;
}

const defaultUser: UserProfile = {
  uid: "learner-local",
  email: "learner@cloudprep.aws",
  displayName: "AWS Cloud Practitioner",
  photoURL: null,
  isGuest: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  lastLoginAt: "2026-01-01T00:00:00.000Z",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: defaultUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
