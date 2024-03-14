export const loginWithEmail = async (
  loginURL: string,
  { email, password }: { email: string; password: string }
) => {
  try {
    const res = await fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error data:", errorData.error);
      return {
        error: true,
        message: errorData.error,
      };
    } else {
      const jsonResult: { access_token: string } = await res.json();
      return {
        error: false,
        message: jsonResult,
      };
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
