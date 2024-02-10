"use client";

import { API_URL, defaultHeaders } from "@/constants";
import { readCookie } from "@/helpers/cookies";
import { useUser } from "@/state/user";
import { useEffect } from "react";

function Hydrate() {
  const { setUser, user } = useUser();

  async function hydrateUser(token: string) {
    const req = await fetch(`${API_URL}/auth/hydrate`, {
      headers: defaultHeaders(token),
    });
    const body = await req.json();
    if (req.ok) {
      setUser(body);
    }
  }

  useEffect(() => {
    const token = readCookie("cipher_token");
    if (!token || user?.id) return;
    hydrateUser(token);
  }, []);

  return null;
}

export default Hydrate;
