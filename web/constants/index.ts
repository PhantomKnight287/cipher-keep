export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const defaultHeaders = (auth?: string) => {
  const headers = new Headers();
  if (auth) headers.append("Authorization", `Bearer ${auth}`);
  headers.append("Content-type", "application/json");
  return headers;
};
