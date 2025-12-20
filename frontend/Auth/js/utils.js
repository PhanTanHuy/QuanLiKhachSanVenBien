export async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(url, {
    ...options,
    
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
      return;
    }

    const data = await refreshRes.json();
    localStorage.setItem("accessToken", data.accessToken);

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
      credentials: "include",
    });
  }

  return res;
}
