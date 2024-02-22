/* const loginURL = process.env.NEXT_PUBLIC_URL_EMAIL_AUTH || "/api/auth/email/login"; */

export const loginWithEmail = async ({ email, password }: { email: string; password: string }) => {
  try {
    const res = await fetch("/api/login", {
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
