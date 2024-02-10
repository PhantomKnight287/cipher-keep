"use server";

import { API_URL } from "@/constants";
import { cookies } from "next/headers";
import { z } from "zod";

const signInZodSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default async function signin(formData: FormData) {
  const parsed = signInZodSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (parsed.success === false) return { error: "Invalid Values" };
  const req = await fetch(`${API_URL}/auth/login`, {
    body: JSON.stringify({
      ...parsed.data,
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  const body = await req.json();
  if (!req.ok) return { error: body.message || "An Unexpected Error Occurred" };
  cookies().set("cipher_token", body.token, {
    httpOnly: false,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });
  return { user: body.user };
}
