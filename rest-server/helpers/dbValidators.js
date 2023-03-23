const Role = require("../models/role");
const Usuario = require("../models/usuario");

const validateRolExist = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El role ${role} no está registrado en la BD`);
  }
};

const mailExist = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ya esta registrado`);
  }
};

const existUserID = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El ID: ${id} no existe`);
  }
};
module.exports = {
  validateRolExist,
  mailExist,
  existUserID,
};
