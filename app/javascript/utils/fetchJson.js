export async function fetchJson(
  url,
  { method = "GET", params = {}, body = null } = {}
) {
  const query = new URLSearchParams(params).toString();
  const fullUrl = query ? `${url}?${query}` : url;

  const response = await fetch(fullUrl, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const msg = data.errors?.join(", ") || data.error || "Something went wrong";
    throw new Error(msg);
  }

  return data;
}