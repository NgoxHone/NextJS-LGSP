const NUMB = 0;
const URL_ARR = ["http://localhost:3000", "https://thongkelgsp.cqdtcamau.vn/"];
export const CONFIG = {
  REDIRECT_URI: URL_ARR[NUMB],
  CLIENT_URL: URL_ARR[NUMB],
  SCOPE: "openid",
  RESPONSE_TYPE: "code",
  GRANT_TYPE: "authorization_code",
  CLIENT_ID: "lHXHGXhxyOds5wxaaFoYdicDSvQa",
  CLIENT_SECRET: "1ZaQ6RpptbkTOduOJcq6f0UvMwMa",
  LOGOUT_URL: "https://idp.cqdtcamau.vn/oidc/logout",
  TOKEN_ENDPOINT: "https://idp.cqdtcamau.vn/oauth2/token",
  AUTHORIZE_ENDPOINT: "https://idp.cqdtcamau.vn/oauth2/authorize",
};
