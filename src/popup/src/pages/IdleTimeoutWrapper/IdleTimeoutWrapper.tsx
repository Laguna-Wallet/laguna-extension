import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useIdleTimer } from "react-idle-timer";
// import { sendMessagePromise } from "utils/chrome";
import { Messages } from "utils/types";
import browser from "webextension-polyfill";

export default function IdleTimeoutWrapper({ children }: { children: React.ReactChild }) {
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    async function go() {
      const AuthResponse = await browser.runtime.sendMessage({ type: Messages.AuthCheck });
      // setIsLoggedIn(AuthResponse.payload.isLoggedIn);
    }

    go();
  }, []);

  const onAction = async () => {
    chrome.runtime.sendMessage({ type: Messages.ResetTimeout });
  };

  const idleTimer = useIdleTimer({ onAction });

  return <Container>{children}</Container>;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
