import { OAuth2Client } from "google-auth-library";

const clientId =
  "389965029020-2c71sgd5bku35i957c5al69uh1hb39pv.apps.googleusercontent.com";

const client = new OAuth2Client({
  clientId,
});

export async function verifyIdToken(idToken) {
  const LoginTicket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });
  const userData = LoginTicket.getPayload();
  return userData;
}
