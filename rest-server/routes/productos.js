const { Router } = require("express");
const { check } = require("express-validator");
const {
  setProducto,
  getProductos,
  getProductoByID,
  updateProducto,
  deleteProducto,
} = require("../controllers/productosController");
const { existProductoID } = require("../helpers/dbValidators");
const { validateJWT } = require("../middleware");
const validateFields = require("../middleware/validateFields");

const router = Router();

router.get("/", getProductos);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existProductoID),
  ],
  validateFields,
  getProductoByID
);

router.post(
  "/",
  [
    validateJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatoria").not().isEmpty(),
    validateFields,
  ],
  setProducto
);

router.put(
  "/:id",
  validateJWT,
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existProductoID),
  ],
  validateFields,
  updateProducto
);

router.delete(
  "/:id",
  validateJWT,
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existProductoID),
  ],
  validateFields,
  deleteProducto
);

module.exports = router;
