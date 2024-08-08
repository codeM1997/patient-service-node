import passport from "passport";
import { Strategy } from "passport-local";
import Admin from "../mongoose/adminSchema.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  console.log("Serialize user", user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  console.log("Deserialize user", id);
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error("User not found");
    }
    done(null, admin);
  } catch (err) {
    done(err, null);
  }
});
export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log("Username", username);
    console.log("Password", password);
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        throw new Error("User not found");
      }
      if (!comparePassword(password, admin.password)) {
        throw new Error("Incorrect password");
      }

      return done(null, admin);
    } catch (err) {
      return done(err, null);
    }
  })
);
