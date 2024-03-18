const authorize = async () => {
  const params = new URLSearchParams();
  params.append(
    "client_id",
    "894371863717-fqa95n9tp0f7g40lumdtom5gtl89neim.apps.googleusercontent.com"
  );
  params.append("redirect_uri", "https://id-card-detector.netlify.app");
  params.append("response_type", "code");
  params.append("access_type", "offline");
  params.append("scope", "https://www.googleapis.com/auth/spreadsheets");

  const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;

  return authUrl;
};

export default authorize;
