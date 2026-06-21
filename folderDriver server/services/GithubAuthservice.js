import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CLIENT_Id = process.env.GITHUB_CLIENT_ID;
console.log(process.env.GITHUB_CLIENT_ID);
passport.use(
  new GitHubStrategy(
    {
      clientID: CLIENT_Id,
      clientSecret: CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      const email = profile.emails?.[0]?.value || `${profile.id}@github.com`;
      const user = {
        name: profile.displayName || profile.username,
        email,
        picture: profile._json.avatar_url,
      };
      return done(null, user);
    },
  ),
);
