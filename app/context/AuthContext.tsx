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

import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";

import {
  createClient,
} from "../lib/supabase/client";

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
): string {
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
    typeof supabaseUser
      .user_metadata?.full_name ===
    "string"
      ? supabaseUser
          .user_metadata
          .full_name
      : typeof supabaseUser
            .user_metadata?.name ===
          "string"
        ? supabaseUser
            .user_metadata
            .name
        : "";

  const email =
    supabaseUser.email ?? "";

  const fallbackName =
    email
      .split("@")[0]
      .trim() || "Mayor";

  const name =
    fullName.trim() ||
    fallbackName;

  return {
    id: supabaseUser.id,
    name,
    email,
    initials: getInitials(name),
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
  ] = useState<AuthUser | null>(
    null
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  /* =========================
     REFRESH USER
  ========================= */

  const refreshUser =
    useCallback(async () => {
      try {
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
      } catch {
        setUser(null);
      }
    }, [supabase]);

  /* =========================
     RESTORE SESSION
  ========================= */

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      setIsLoading(true);

      try {
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
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
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
          if (!isMounted) {
            return;
          }

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

  const register =
    useCallback(
      async (
        name: string,
        email: string,
        password: string
      ): Promise<AuthResult> => {
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
          const redirectUrl =
            `${window.location.origin}/auth/confirm`;

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

                emailRedirectTo:
                  redirectUrl,
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
            Confirm Email مفعّل:
            Supabase ينشئ المستخدم
            لكن لا ينشئ Session قبل
            تأكيد البريد.
          */

          if (!data.session) {
            setUser(null);

            return {
              success: true,
              message:
                "Account created. Please confirm your email to continue.",
              emailConfirmationRequired:
                true,
            };
          }

          /*
            Confirm Email غير مفعّل:
            توجد Session مباشرة،
            لذلك المستخدم مسجل دخول.
          */

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
      },
      [supabase]
    );

  /* =========================
     LOGIN
  ========================= */

  const login =
    useCallback(
      async (
        email: string,
        password: string
      ): Promise<AuthResult> => {
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
            const needsConfirmation =
              error.message
                .toLowerCase()
                .includes(
                  "email not confirmed"
                );

            return {
              success: false,

              message:
                needsConfirmation
                  ? "Please confirm your email before signing in."
                  : error.message,

              emailConfirmationRequired:
                needsConfirmation,
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
      },
      [supabase]
    );

  /* =========================
     LOGOUT
  ========================= */

  const logout =
    useCallback(
      async (): Promise<AuthResult> => {
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

          window.location.replace(
            "/login"
          );

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
      },
      [supabase]
    );

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,

        isLoading,

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
        register,
        login,
        logout,
        refreshUser,
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