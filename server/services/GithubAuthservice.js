import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

const CLIENT_SECRET = "fc76f57276eabfddd9c9796c8f82d1e3410b858d";
const CLIENT_Id = "Ov23liEfkaP2evvySBQS";

passport.use(
  new GitHubStrategy(
    {
      clientID: CLIENT_Id,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const email = profile.emails?.[0]?.value || `${profile.id}@github.com`;
      const user = {
        name: profile.displayName || profile.username,
        email,
        picture: profile._json.avatar_url,
      };
      return done(null, user);
    }
  )
);
