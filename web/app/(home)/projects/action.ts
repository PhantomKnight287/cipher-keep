"use server";

import { API_URL, defaultHeaders } from "@/constants";
import { cookies } from "next/headers";
import { z } from "zod";

const zodSchema = z.object({
  name: z.string().min(1, { message: "Please enter project name" }),
});

export default async function createNewProject(formData: FormData) {
  const parsed = zodSchema.safeParse({ name: formData.get("name") });
  if (parsed.success === false)
    return { error: parsed.error.errors[0].message };
  const token = cookies().get("cipher_token");
  if (!token?.value) return { error: "You must login to create an account" };
  const req = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: defaultHeaders(token.value),
    body: JSON.stringify(parsed.data),
  });
  const body = await req.json();
  if (!req.ok) return { error: body.message };
  return { keys: body.keys.privateKey, projectName: body.project[0].name };
}
