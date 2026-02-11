import { useState, useEffect } from "react";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(localStorage.getItem("token"));
  }, []);

  return token;
}

