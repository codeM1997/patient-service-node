import e, { Router } from "express";
const router = Router();
import passport from "passport";
router.post("", passport.authenticate("local"), (req, res) => {
  console.log("Req user in auth", req.user);
  return res.send({ msg: "Auth success" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      
      if(err.name.includes('Mongoose')){
        return res.status(500).send({msg:'Mongo DB is not working'})
      }
      return res.status(500).send(err);
    }
    if (!user) {
      return res.send({ success: false, msg: "Credential do not match" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success: true, msg: "authentication succeeded" });
    });
  })(req, res, next);
});

router.get("/status", (req, res) => {
  console.log(">", req.session);
  console.log(req.user);
  return req.user
    ? res.status(200).send(req.user)
    : res.status(401).send({ msg: "User not authenticated" });
});
router.post("/logout", (req, res) => {
  if (!req.user) return res.status(401).send({ msg: "User not authenticated" });
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.status(200).send({ msg: "User logged out" });
  });
});

export default router;
