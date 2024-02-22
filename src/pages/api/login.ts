import { serialize, type CookieSerializeOptions } from "cookie";
import { AUTH_COOKIE_NAME } from "lib/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
const loginURL = process.env.NEXT_PUBLIC_URL_EMAIL_AUTH || "/api/auth/email/login";

const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
  sameSite: "lax",
  secure: true,
};

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

export default async function sessionAPI(req: NextApiRequest, res: NextApiResponse) {
  // allow only post requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const inputs = schema.safeParse(req.body);

  if (!inputs.success) {
    return res.status(400).json({ message: "Bad Request", errors: inputs.error });
  }

  const { email, password } = inputs.data;

  const response = await fetch(loginURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email, password: password }),
  });

  if (response.ok) {
    const responseData = await response.json();
    const accessToken = responseData.access_token;

    res.setHeader("Set-Cookie", [serialize(AUTH_COOKIE_NAME, accessToken, cookieOptions)]);
    res.status(200).json({ message: "session created successfully", access_token: accessToken });
  } else {
    res.status(500).json({ error: "Something went wrong." });
  }
}
