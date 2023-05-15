import config from "~/configs";

function getOAuth2GoogleURL() {
  const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: config.google.urlRedirect,
    client_id: config.google.clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootURL}?${qs.toString()}`;
}

export default getOAuth2GoogleURL;
