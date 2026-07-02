"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CityWalletUser = {
  name: string;
  email: string;
  initials: string;
};

type StoredAccount = {
  user: CityWalletUser;
  password: string;
};

type AuthResult = {
  success: boolean;
  message: string;
};

type AuthContextType = {
  user: CityWalletUser | null;
  isReady: boolean;
  isAuthenticated: boolean;

  register: (
    name: string,
    email: string,
    password: string
  ) => AuthResult;

  login: (
    email: string,
    password: string
  ) => AuthResult;

  updateUser: (values: {
    name: string;
    email: string;
  }) => AuthResult;

  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

const ACCOUNT_KEY = "fincity-account";
const CURRENT_USER_KEY =
  "fincity-current-user";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "M";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<CityWalletUser | null>(null);

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const storedUser =
      window.sessionStorage.getItem(
        CURRENT_USER_KEY
      );

    if (storedUser) {
      try {
        setUser(
          JSON.parse(
            storedUser
          ) as CityWalletUser
        );
      } catch {
        window.sessionStorage.removeItem(
          CURRENT_USER_KEY
        );
      }
    }

    setIsReady(true);
  }, []);

  const saveCurrentUser = useCallback(
    (nextUser: CityWalletUser) => {
      setUser(nextUser);

      window.sessionStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(nextUser)
      );
    },
    []
  );

  const register = useCallback(
    (
      name: string,
      email: string,
      password: string
    ): AuthResult => {
      const cleanName = name.trim();
      const cleanEmail =
        normalizeEmail(email);

      if (cleanName.length < 2) {
        return {
          success: false,
          message:
            "Please enter your full name.",
        };
      }

      if (
        !cleanEmail.includes("@") ||
        !cleanEmail.includes(".")
      ) {
        return {
          success: false,
          message:
            "Please enter a valid email address.",
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message:
            "Password must contain at least 6 characters.",
        };
      }

      const nextUser: CityWalletUser = {
        name: cleanName,
        email: cleanEmail,
        initials:
          createInitials(cleanName),
      };

      const account: StoredAccount = {
        user: nextUser,
        password,
      };

      window.sessionStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(account)
      );

      saveCurrentUser(nextUser);

      return {
        success: true,
        message:
          "Account created successfully.",
      };
    },
    [saveCurrentUser]
  );

  const login = useCallback(
    (
      email: string,
      password: string
    ): AuthResult => {
      const cleanEmail =
        normalizeEmail(email);

      const storedAccount =
        window.sessionStorage.getItem(
          ACCOUNT_KEY
        );

      if (!storedAccount) {
        return {
          success: false,
          message:
            "No account was found. Please register first.",
        };
      }

      try {
        const account =
          JSON.parse(
            storedAccount
          ) as StoredAccount;

        if (
          account.user.email !==
            cleanEmail ||
          account.password !== password
        ) {
          return {
            success: false,
            message:
              "Incorrect email or password.",
          };
        }

        saveCurrentUser(account.user);

        return {
          success: true,
          message: "Login successful.",
        };
      } catch {
        window.sessionStorage.removeItem(
          ACCOUNT_KEY
        );

        return {
          success: false,
          message:
            "Account data is invalid.",
        };
      }
    },
    [saveCurrentUser]
  );

  const updateUser = useCallback(
    ({
      name,
      email,
    }: {
      name: string;
      email: string;
    }): AuthResult => {
      if (!user) {
        return {
          success: false,
          message:
            "No signed-in user was found.",
        };
      }

      const cleanName = name.trim();
      const cleanEmail =
        normalizeEmail(email);

      if (cleanName.length < 2) {
        return {
          success: false,
          message:
            "Please enter a valid name.",
        };
      }

      if (
        !cleanEmail.includes("@") ||
        !cleanEmail.includes(".")
      ) {
        return {
          success: false,
          message:
            "Please enter a valid email.",
        };
      }

      const nextUser: CityWalletUser = {
        name: cleanName,
        email: cleanEmail,
        initials:
          createInitials(cleanName),
      };

      saveCurrentUser(nextUser);

      const storedAccount =
        window.sessionStorage.getItem(
          ACCOUNT_KEY
        );

      if (storedAccount) {
        try {
          const account =
            JSON.parse(
              storedAccount
            ) as StoredAccount;

          window.sessionStorage.setItem(
            ACCOUNT_KEY,
            JSON.stringify({
              ...account,
              user: nextUser,
            })
          );
        } catch {
          window.sessionStorage.removeItem(
            ACCOUNT_KEY
          );
        }
      }

      return {
        success: true,
        message:
          "Account updated successfully.",
      };
    },
    [saveCurrentUser, user]
  );

  const logout = useCallback(() => {
    setUser(null);

    window.sessionStorage.removeItem(
      CURRENT_USER_KEY
    );
  }, []);

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,
        isReady,
        isAuthenticated:
          Boolean(user),
        register,
        login,
        updateUser,
        logout,
      }),
      [
        user,
        isReady,
        register,
        login,
        updateUser,
        logout,
      ]
    );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}