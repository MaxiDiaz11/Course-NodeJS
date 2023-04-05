const { Router } = require("express");
const { check } = require("express-validator");
const validateFields = require("../middleware/validateFields");
const {
  setFiles,
  updateImage,
  getImage,
  updateImageWithCloudinary,
} = require("../controllers/uploadsController");
const { coleccionesPermitidas } = require("../helpers/dbValidators");
const validateFile = require("../middleware/validateFile");

const router = Router();

router.post("/", validateFile, setFiles);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El ID debe ser uno de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
  ],
  validateFields,
  getImage
);

router.put(
  "/:coleccion/:id",
  [
    validateFile,
    check("id", "El ID debe ser uno de Mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
  ],
  validateFields,
  //   updateImage
  updateImageWithCloudinary
);

module.exports = router;
