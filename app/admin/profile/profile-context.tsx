"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ProfileContextValue = {
  profileVersion: number;
  refreshProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileVersion, setProfileVersion] = useState(0);

  const context = useMemo(
    () => ({
      profileVersion,
      refreshProfile: () => {
        setProfileVersion((currentVersion) => currentVersion + 1);
      },
    }),
    [profileVersion],
  );

  return (
    <ProfileContext.Provider value={context}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

