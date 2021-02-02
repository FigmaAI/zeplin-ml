import React, { useState, useEffect } from "react";
// import { onClientLoad } from "../services/google";
import { ZEPLIN_TOKEN_STORAGE_KEY } from "../constants";

const AuthContext = React.createContext();

const storedZeplinToken = localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY);

function AuthProvider({ children }) {
  // const [isAuthenticatingGoogle, setGoogleAuthenticating] = useState(true);
  const [zeplinToken, setZeplinToken] = useState(storedZeplinToken);
  // const [googleUser, setGoogleUser] = useState(false);

  // useEffect(() => {
  //   onClientLoad(user => {
  //     setGoogleUser(user);

  //     setGoogleAuthenticating(false);
  //   });
  // }, []);

  const connectZeplin = (token) => {
    localStorage.setItem(ZEPLIN_TOKEN_STORAGE_KEY, token);

    setZeplinToken(token);
  };

  const disconnectZeplin = () => {
    localStorage.removeItem(ZEPLIN_TOKEN_STORAGE_KEY);

    setZeplinToken(null);
  };

  const isZeplinConnected = !!zeplinToken;
  // const isGoogleConnected = !!googleUser;

  // const isAllConnected = isZeplinConnected && !!isGoogleConnected;
  const isAllConnected = isZeplinConnected;

  const zeplinContextValues = {
    zeplinToken,
    connectZeplin,
    disconnectZeplin,
    isZeplinConnected,
  };

  // const googleContextValues = {
  //   googleUser,
  //   setGoogleUser,
  //   isGoogleConnected,
  //   isAuthenticatingGoogle,
  // };

  return (
    <AuthContext.Provider
      // value={{ isAllConnected, ...zeplinContextValues, ...googleContextValues }}
      value={{ isAllConnected, ...zeplinContextValues }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
