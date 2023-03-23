const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarioController");
const validateFields = require("../middleware/validateFields");
const Role = require("../models/role");
const {
  mailExist,
  validateRolExist,
  existUserID,
} = require("../helpers/dbValidators");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existUserID),
    check("rol").custom(validateRolExist),
  ],
  validateFields,
  usuariosPut
);

router.post(
  "/",
  [
    check("correo", "El correo no es válido").isEmail(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check("rol", "El rol no es valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(validateRolExist),
    check("correo").custom(mailExist),
    check("password", "El password debe ser de más de 6 letras").isLength({
      min: 6,
    }),
    validateFields,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existUserID),
  ],
  validateFields,
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
