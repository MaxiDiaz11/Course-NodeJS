const validateFields = require("../middleware/validateFields");
const validateJWT = require("../middleware/validateJWT");
const validateRoles = require("../middleware/validateRole");
const validateFile = require("../middleware/validateFile");

module.exports = {
  ...validateFile,
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
};
