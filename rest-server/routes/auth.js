const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const validateFields = require("../middleware/validateFields");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "id_token es obligatorio").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
