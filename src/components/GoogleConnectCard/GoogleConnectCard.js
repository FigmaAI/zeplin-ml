import React from "react";

import { useAuth } from "../../providers/AuthProvider";
import {
  onSignInClick,
  onSignOutClick,
} from "../../services/google";

import ConnectCard from "../ConnectCard";

export default function GoogleConnectCard() {
  const { isGoogleConnected, googleUser, setGoogleUser, isAuthenticatingGoogle } = useAuth();

  const onDisconnect = () => {
    onSignOutClick();

    setGoogleUser(null);
  };

  return (
    <ConnectCard
      accountName="Google"
      accountEmail={googleUser && googleUser.email}
      description="Connect your Google account to allow creating slides."
      onConnect={onSignInClick}
      onDisconnect={onDisconnect}
      isConnected={isGoogleConnected}
      buttonIcon={<img src="/google.png" width="18" height="18" alt="Google"/>}
      authenticating={isAuthenticatingGoogle}
    />
  );
}
