"use server";

import { API_URL, defaultHeaders } from "@/constants";
import { cookies } from "next/headers";
import { z } from "zod";

const signUpZodSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long" }),
});

export default async function signUp(formData: FormData) {
  const parsedResult = signUpZodSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (parsedResult.success === false)
    return { error: parsedResult.error.errors[0].message };
  const req = await fetch(`${API_URL}/auth/register`, {
    headers: defaultHeaders(),
    method: "POST",
    body: JSON.stringify({ ...parsedResult.data }),
  });
  const body = await req.json();
  if (!req.ok) return { error: body.message || "An Unexpected Error Occurred" };

  cookies().set("cipher_token", body.token, {
    httpOnly: false,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });
  return { user: body.user };
}
