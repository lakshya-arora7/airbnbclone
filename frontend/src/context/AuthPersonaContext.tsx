"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPersona, UserRole } from "@/types";
import { api } from "@/lib/api";
import AuthModal from "@/components/auth/AuthModal";

export const PRESET_PERSONAS: Record<string, UserPersona> = {
  GUEST: {
    id: 1,
    email: "lakshya@gmail.com",
    fullName: "Lakshya Arora",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    role: "GUEST",
    isSuperhost: false,
    hostSince: "January 2024",
    bio: "Software engineer & world traveler passionate about architecture and heritage stays."
  },
  HOST_RAVI: {
    id: 2,
    email: "ravi.sharma@gmail.com",
    fullName: "Ravi Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    role: "HOST",
    isSuperhost: true,
    hostSince: "March 2022",
    bio: "Architect and Superhost passionate about thoughtful interior spaces and authentic hospitality."
  },
  HOST_SARAH: {
    id: 3,
    email: "sarah.jenkins@gmail.com",
    fullName: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    role: "HOST",
    isSuperhost: true,
    hostSince: "August 2021",
    bio: "Interior architect and luxury villa curator across Europe and Asia."
  }
};

const DEFAULT_PERSONAS_LIST: UserPersona[] = [
  PRESET_PERSONAS.GUEST,
  PRESET_PERSONAS.HOST_RAVI,
  PRESET_PERSONAS.HOST_SARAH,
];

interface AuthPersonaContextType {
  persona: UserPersona;
  isAuthenticated: boolean;
  isGuest: boolean;
  isHost: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  login: (loginId: string, role?: UserRole, fullName?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  selectPersona: (p: UserPersona) => Promise<void>;
  availablePersonas: UserPersona[];
  setPersonaRole: (role: UserRole) => void;
  switchToHosting: () => void;
  switchToTravelling: () => void;
  togglePersona: () => void;
  updateProfile: (updates: Partial<UserPersona>) => void;
}

const AuthPersonaContext = createContext<AuthPersonaContextType | undefined>(undefined);

export function AuthPersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = useState<UserPersona>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSession = localStorage.getItem("airbnb_active_user_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.id && parsed.role) {
            return parsed;
          }
        }
        const savedRole = localStorage.getItem("airbnb_demo_persona_role") as UserRole;
        if (savedRole === "HOST") {
          return PRESET_PERSONAS.HOST_RAVI;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return PRESET_PERSONAS.GUEST;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [modalInitialRole, setModalInitialRole] = useState<UserRole>("GUEST");
  const [availablePersonas, setAvailablePersonas] = useState<UserPersona[]>(DEFAULT_PERSONAS_LIST);

  // 1. Initial hydration and backend sync
  useEffect(() => {
    // Fetch live users from backend database if available
    api.getUsers().then((liveUsers) => {
      if (Array.isArray(liveUsers) && liveUsers.length > 0) {
        const mapped: UserPersona[] = liveUsers.map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.full_name || u.fullName,
          avatarUrl: u.avatar_url || u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          role: (u.role || "GUEST").toUpperCase() as UserRole,
          isSuperhost: !!u.is_superhost,
          hostSince: u.host_since || "March 2024",
          bio: u.bio || "",
        }));
        setAvailablePersonas(mapped);
      }
    });

    // Check localStorage for saved persona session
    try {
      const savedSession = localStorage.getItem("airbnb_active_user_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id && parsed.role) {
          setPersona(parsed);
          setIsAuthenticated(true);
          return;
        }
      }

      const savedRole = localStorage.getItem("airbnb_demo_persona_role") as UserRole;
      if (savedRole === "HOST") {
        setPersona(PRESET_PERSONAS.HOST_RAVI);
      } else {
        setPersona(PRESET_PERSONAS.GUEST);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openAuthModal = (defaultRole: UserRole = "GUEST") => {
    setModalInitialRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Perform simplified authentication with notion of Guest vs Host
  const login = async (loginId: string, role: UserRole = "GUEST", fullName?: string): Promise<boolean> => {
    try {
      const backendUser = await api.login(loginId, role, fullName);
      let targetPersona: UserPersona;

      if (backendUser && backendUser.id) {
        targetPersona = {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.full_name || fullName || (role === "HOST" ? "Ravi Sharma" : "Lakshya Arora"),
          avatarUrl: backendUser.avatar_url || (role === "HOST" ? PRESET_PERSONAS.HOST_RAVI.avatarUrl : PRESET_PERSONAS.GUEST.avatarUrl),
          role: role,
          isSuperhost: role === "HOST",
          hostSince: backendUser.host_since || "September 2026",
          bio: backendUser.bio || (role === "HOST" ? "Experienced Superhost" : "Verified Guest"),
        };
      } else {
        // Local fallback
        targetPersona = role === "HOST" ? PRESET_PERSONAS.HOST_RAVI : PRESET_PERSONAS.GUEST;
        if (loginId.includes("@")) {
          targetPersona = { ...targetPersona, email: loginId };
        }
      }

      setPersona(targetPersona);
      setIsAuthenticated(true);
      localStorage.setItem("airbnb_active_user_session", JSON.stringify(targetPersona));
      localStorage.setItem("airbnb_demo_persona_role", role);
      return true;
    } catch (err) {
      console.warn("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Switch to guest browsing view
    setPersona({
      id: 0,
      email: "",
      fullName: "Guest",
      avatarUrl: "",
      role: "GUEST",
      isSuperhost: false,
      hostSince: "2026",
    });
    localStorage.removeItem("airbnb_active_user_session");
  };

  const selectPersona = async (p: UserPersona) => {
    setPersona(p);
    setIsAuthenticated(true);
    localStorage.setItem("airbnb_active_user_session", JSON.stringify(p));
    localStorage.setItem("airbnb_demo_persona_role", p.role);
    try {
      await api.selectUser(p.id);
    } catch (e) {
      console.warn("Select user sync error:", e);
    }
  };

  const switchRole = async (role: UserRole) => {
    const matching = availablePersonas.find((p) => p.role === role);
    if (matching) {
      await selectPersona(matching);
    } else {
      const fallback = role === "HOST" ? PRESET_PERSONAS.HOST_RAVI : PRESET_PERSONAS.GUEST;
      await selectPersona(fallback);
    }
  };

  const setPersonaRole = (role: UserRole) => {
    switchRole(role);
  };

  const switchToHosting = () => {
    switchRole("HOST");
  };

  const switchToTravelling = () => {
    switchRole("GUEST");
  };

  const togglePersona = () => {
    const nextRole: UserRole = persona.role === "GUEST" ? "HOST" : "GUEST";
    switchRole(nextRole);
  };

  const updateProfile = (updates: Partial<UserPersona>) => {
    setPersona((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("airbnb_active_user_session", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <AuthPersonaContext.Provider
      value={{
        persona,
        isAuthenticated,
        isGuest: persona.role === "GUEST",
        isHost: persona.role === "HOST",
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        switchRole,
        selectPersona,
        availablePersonas,
        setPersonaRole,
        switchToHosting,
        switchToTravelling,
        togglePersona,
        updateProfile,
      }}
    >
      {children}

      {/* Global Auth Modal matching exact screenshot */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialRole={modalInitialRole}
      />
    </AuthPersonaContext.Provider>
  );
}

export function useAuthPersona() {
  const context = useContext(AuthPersonaContext);
  if (!context) {
    throw new Error("useAuthPersona must be used within an AuthPersonaProvider");
  }
  return context;
}
