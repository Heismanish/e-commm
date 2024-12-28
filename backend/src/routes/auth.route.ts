import { Router } from "express";
import {
  accessToken,
  login,
  logout,
  profile,
  singup,
} from "../controllers/auth.controller";

const router = Router();

router.get("/test", (req, res) => {
  res.send("auth routes working");
});

router.post("/signup", singup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/access-token", accessToken);
router.get("/profile", profile);

export default router;
