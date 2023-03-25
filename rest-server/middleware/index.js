const validateFields = require("../middleware/validateFields");
const validateJWT = require("../middleware/validateJWT");
const validateRoles = require("../middleware/validateRole");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
};
