export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required"});
  }

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    res.setHeader(
      "Set-Cookie",
      `admin_auth=true; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
    );
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Invalid credentials" , invalid: true });
  }
}
