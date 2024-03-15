const authorize = async () => {
  console.log("GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log("GOOGLE_SECRET_KEY:", import.meta.env.VITE_GOOGLE_SECRET_KEY);
  console.log("GOOGLE_URL:", import.meta.env.VITE_GOOGLE_URL);

  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  //   params.append("client_secret", import.meta.env.VITE_GOOGLE_SECRET_KEY);
  params.append("redirect_uri", import.meta.env.VITE_GOOGLE_URL);
  params.append("response_type", "code");
  params.append("access_type", "offline");
  params.append("scope", "https://www.googleapis.com/auth/spreadsheets");

  const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;

  window.location.href = authUrl;
};

export default authorize;
