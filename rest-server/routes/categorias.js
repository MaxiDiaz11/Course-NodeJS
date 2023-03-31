const { Router } = require("express");
const { check } = require("express-validator");
const {
  setCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} = require("../controllers/categoriasController");
const { existCategoriaID } = require("../helpers/dbValidators");
const { validateJWT, hasRole } = require("../middleware");

const validateFields = require("../middleware/validateFields");

const router = Router();

//publico
router.get("/", getCategorias);

//publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existCategoriaID),
  ],
  validateFields,
  getCategoriaById
);

//privado
router.post(
  "/",
  [
    validateJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  setCategoria
);

//privado
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existCategoriaID),
    validateJWT,
  ],
  validateFields,
  updateCategoria
);

//privado - Admin_User
router.delete(
  "/:id",
  validateJWT,
  hasRole("ADMIN_ROLE"),
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existCategoriaID),
  ],
  validateFields,
  deleteCategoria
);

module.exports = router;
