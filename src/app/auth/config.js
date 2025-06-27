const NUMB = 1;
const URL_ARR = ["http://localhost:3000", "https://thongkelgsp.cqdtcamau.vn/"];
export const CONFIG = {
  REDIRECT_URI: URL_ARR[NUMB],
  CLIENT_URL: URL_ARR[NUMB],
  SCOPE: "openid",
  RESPONSE_TYPE: "code",
  GRANT_TYPE: "authorization_code",
  CLIENT_ID: "kyFHLrRw1GfsTMOY9dvkfKfxT6Qa",
  CLIENT_SECRET: "nVF2s4zQoRrr7fAXhoyYB4r9Gt8a",
  LOGOUT_URL: "https://idp.cqdtcamau.vn/oidc/logout",
  TOKEN_ENDPOINT: "https://idp.cqdtcamau.vn/oauth2/token",
  AUTHORIZE_ENDPOINT: "https://idp.cqdtcamau.vn/oauth2/authorize",
};
