export const loginWithGoogle = async (idToken) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${VITE_API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();
  return data;
};
