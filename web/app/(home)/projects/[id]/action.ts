"use server";

import { API_URL, defaultHeaders } from "@/constants";
import { Environment } from "@/types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const zodSchema = z.object({
  name: z.string().min(1, { message: "Please enter name of the secret" }),
  value: z.string().min(1, { message: "Please enter value of the secret" }),
  environment: z.nativeEnum(Environment),
  projectId: z.string(),
});

export default async function createNewSecret(formData: FormData) {
  const parsed = zodSchema.safeParse({
    name: formData.get("name"),
    value: formData.get("value"),
    environment: formData.get("environment"),
    projectId: formData.get("projectId"),
  });
  if (parsed.success === false)
    return { error: parsed.error.errors[0].message };
  const cookiesStore = cookies();
  const tokenCookie = cookiesStore.get("cipher_token");
  if (!tokenCookie || !tokenCookie.value) redirect("/login");
  const req = await fetch(`${API_URL}/secrets/${parsed.data.projectId}`, {
    method: "POST",
    headers: defaultHeaders(tokenCookie.value),
    body: JSON.stringify(parsed.data),
  });
  const body = await req.json();
  if (!req.ok) return { error: body.message };

  revalidateTag(`projectInfo::${parsed.data.projectId}`);
  return { id: body.id };
}
