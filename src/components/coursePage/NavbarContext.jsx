// NavbarContext.jsx
"use client";
import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [mainNavbarVisible, setMainNavbarVisible] = useState(true);

  return (
    <NavbarContext.Provider value={{ mainNavbarVisible, setMainNavbarVisible }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider');
  }
  return context;
};
