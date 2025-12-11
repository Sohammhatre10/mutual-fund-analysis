import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("fund-analyser-user");
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("fund-analyser-user", user);
    } else {
      localStorage.removeItem("fund-analyser-user");
    }
  }, [user]);

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
