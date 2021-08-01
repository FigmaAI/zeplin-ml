import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { useStore } from "../../providers/StoreProvider";
import { useAuth } from "../../providers/AuthProvider";
import {
  fetchAccessToken,
  authorize as authorizeZeplin,
} from "../../services/zeplin";

import ConnectCard from "../ConnectCard";

function ZeplinConnectCard() {
  const { search } = useLocation();
  const history = useHistory();
  const { actions, selectors } = useStore();
  const { isZeplinConnected, connectZeplin, disconnectZeplin } = useAuth();
  const [authenticating, setAuthenticating] = useState(false);

  const code = new URLSearchParams(search).get("code");
  const zeplinUser = selectors.zeplinUser();

  useEffect(() => {
    async function getZeplinToken(code) {
      try {
        setAuthenticating(true);
        const { access_token } = await fetchAccessToken(code);

        if (access_token) {
          connectZeplin(access_token);
          console.log(access_token);
          setAuthenticating(false);

          history.replace("/");
        }
      } catch {
        // noop
      }
    }

    if (code) {
      getZeplinToken(code);
    }
  }, []);

  useEffect(() => {
    if (isZeplinConnected && !zeplinUser) {
      actions.getZeplinUser();
    }
  }, [isZeplinConnected, zeplinUser]);

  return (
    <ConnectCard
      accountName="Zeplin"
      accountEmail={zeplinUser && zeplinUser.email}
      description="Connect your Zeplin account to allow access to your projects."
      onConnect={authorizeZeplin}
      onDisconnect={disconnectZeplin}
      isConnected={isZeplinConnected}
      buttonIcon={<img src="/zeplin.png" width="18" height="18" alt="Zeplin"/>}
      authenticating={authenticating}
    />
  );
}

export default ZeplinConnectCard;
