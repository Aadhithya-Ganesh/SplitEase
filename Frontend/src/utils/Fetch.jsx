export async function apiFetch(route, options = {}) {
  const baseUrl = `http://localhost:8080${route}`;
  const token = localStorage.getItem("token");

  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = baseUrl;
  if (params && typeof params === "object") {
    const query = new URLSearchParams(params).toString();
    if (query) {
      url += `?${query}`;
    }
  }

  const headers = {
    ...(fetchOptions.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const isJsonBody =
    fetchOptions.body &&
    typeof fetchOptions.body === "object" &&
    !(fetchOptions.body instanceof FormData) &&
    !(fetchOptions.body instanceof URLSearchParams);

  if (isJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: isJsonBody ? JSON.stringify(fetchOptions.body) : fetchOptions.body,
  });

  if (!response.ok) {
    let errorBody = {};
    try {
      errorBody = await response.json();
    } catch {}

    throw new Response(
      JSON.stringify({
        message: errorBody.detail || errorBody.message || "Request failed",
      }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return response;
}
