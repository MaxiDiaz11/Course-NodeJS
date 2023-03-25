const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth");
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

module.exports = router;
