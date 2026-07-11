"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";

import { createClient } from "./supabaseClient";

/* =========================
   TYPES
========================= */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  createdAt: string;
};

export type AuthResult = {
  success: boolean;
  message: string;
  emailConfirmationRequired: boolean;
};

type AuthContextType = {
  user: AuthUser | null;

  isLoading: boolean;

  isReady: boolean;

  isAuthenticated: boolean;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;

  login: (
    email: string,
    password: string
  ) => Promise<AuthResult>;

  logout: () => Promise<AuthResult>;

  refreshUser: () => Promise<void>;
};

/* =========================
   CONTEXT
========================= */

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

/* =========================
   HELPERS
========================= */

function getInitials(
  name: string
) {
  const cleanName = name.trim();

  if (!cleanName) {
    return "M";
  }

  const parts = cleanName
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[
      parts.length - 1
    ].charAt(0)
  ).toUpperCase();
}

function mapSupabaseUser(
  supabaseUser: SupabaseUser
): AuthUser {
  const fullName =
    supabaseUser
      .user_metadata
      ?.full_name;

  const metadataName =
    supabaseUser
      .user_metadata
      ?.name;

  let resolvedName = "";

  if (
    typeof fullName === "string"
  ) {
    resolvedName = fullName;
  } else if (
    typeof metadataName ===
    "string"
  ) {
    resolvedName = metadataName;
  }

  const email =
    supabaseUser.email || "";

  const fallbackName =
    email
      .split("@")[0]
      .trim() ||
    "Mayor";

  const name =
    resolvedName.trim() ||
    fallbackName;

  return {
    id: supabaseUser.id,

    name,

    email,

    initials:
      getInitials(name),

    createdAt:
      supabaseUser.created_at,
  };
}

/* =========================
   PROVIDER
========================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  /* =========================
     LOAD CURRENT USER
  ========================= */

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      setIsLoading(true);

      const {
        data,
        error,
      } =
        await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (
        error ||
        !data.user
      ) {
        setUser(null);
      } else {
        setUser(
          mapSupabaseUser(
            data.user
          )
        );
      }

      setIsLoading(false);
    }

    void loadCurrentUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event: AuthChangeEvent,
          session: Session | null
        ) => {
          if (session?.user) {
            setUser(
              mapSupabaseUser(
                session.user
              )
            );
          } else {
            setUser(null);
          }

          setIsLoading(false);
        }
      );

    return () => {
      isMounted = false;

      subscription.unsubscribe();
    };
  }, [supabase]);

  /* =========================
     REGISTER
  ========================= */

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      cleanName.length < 2
    ) {
      return {
        success: false,

        message:
          "Please enter your full name.",

        emailConfirmationRequired:
          false,
      };
    }

    if (
      !cleanEmail ||
      !cleanEmail.includes("@")
    ) {
      return {
        success: false,

        message:
          "Please enter a valid email address.",

        emailConfirmationRequired:
          false,
      };
    }

    if (
      password.length < 6
    ) {
      return {
        success: false,

        message:
          "Password must contain at least 6 characters.",

        emailConfirmationRequired:
          false,
      };
    }

    try {
      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email: cleanEmail,

          password,

          options: {
            data: {
              full_name:
                cleanName,

              name:
                cleanName,
            },
          },
        });

      if (error) {
        return {
          success: false,

          message:
            error.message,

          emailConfirmationRequired:
            false,
        };
      }

      if (!data.user) {
        return {
          success: false,

          message:
            "The account could not be created. Please try again.",

          emailConfirmationRequired:
            false,
        };
      }

      /*
        إذا كان تأكيد البريد
        مفعّل في Supabase:

        user موجود
        session = null
      */

      if (!data.session) {
        setUser(null);

        return {
          success: true,

          message:
            "Account created successfully. Please confirm your email, then sign in.",

          emailConfirmationRequired:
            true,
        };
      }

      setUser(
        mapSupabaseUser(
          data.user
        )
      );

      return {
        success: true,

        message:
          "Account created successfully.",

        emailConfirmationRequired:
          false,
      };
    } catch {
      return {
        success: false,

        message:
          "Unable to create the account right now. Please try again.",

        emailConfirmationRequired:
          false,
      };
    }
  }

  /* =========================
     LOGIN
  ========================= */

  async function login(
    email: string,
    password: string
  ): Promise<AuthResult> {
    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !cleanEmail.includes("@")
    ) {
      return {
        success: false,

        message:
          "Please enter a valid email address.",

        emailConfirmationRequired:
          false,
      };
    }

    if (!password) {
      return {
        success: false,

        message:
          "Please enter your password.",

        emailConfirmationRequired:
          false,
      };
    }

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              cleanEmail,

            password,
          });

      if (error) {
        return {
          success: false,

          message:
            error.message,

          emailConfirmationRequired:
            false,
        };
      }

      if (!data.user) {
        return {
          success: false,

          message:
            "Unable to sign in. Please try again.",

          emailConfirmationRequired:
            false,
        };
      }

      setUser(
        mapSupabaseUser(
          data.user
        )
      );

      return {
        success: true,

        message:
          "Signed in successfully.",

        emailConfirmationRequired:
          false,
      };
    } catch {
      return {
        success: false,

        message:
          "Unable to sign in right now. Please try again.",

        emailConfirmationRequired:
          false,
      };
    }
  }

  /* =========================
     LOGOUT
  ========================= */

  async function logout():
    Promise<AuthResult> {
    try {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        return {
          success: false,

          message:
            error.message,

          emailConfirmationRequired:
            false,
        };
      }

      setUser(null);

      return {
        success: true,

        message:
          "Signed out successfully.",

        emailConfirmationRequired:
          false,
      };
    } catch {
      return {
        success: false,

        message:
          "Unable to sign out right now.",

        emailConfirmationRequired:
          false,
      };
    }
  }

  /* =========================
     REFRESH USER
  ========================= */

  async function refreshUser() {
    const {
      data,
      error,
    } =
      await supabase.auth.getUser();

    if (
      error ||
      !data.user
    ) {
      setUser(null);

      return;
    }

    setUser(
      mapSupabaseUser(
        data.user
      )
    );
  }

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,

        isLoading,

        isReady:
          !isLoading,

        isAuthenticated:
          Boolean(user),

        register,

        login,

        logout,

        refreshUser,
      }),
      [
        user,
        isLoading,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}