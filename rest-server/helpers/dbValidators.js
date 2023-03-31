const { response } = require("express");
const { Usuario, Categoria, Role, Producto } = require("../models");

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

const existCategoriaID = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El ID: ${id} no existe`);
  }
};

const existProductoID = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El ID: ${id} no existe`);
  }
};

const findCategoria = async (categoria) => {
  let nombre = categoria.toUpperCase();

  const categoriaDB = await Categoria.findOne({
    nombre,
  });

  if (categoriaDB) {
    return categoriaDB;
  } else {
    return false;
  }
};

module.exports = {
  existCategoriaID,
  existProductoID,
  existUserID,
  findCategoria,
  mailExist,
  validateRolExist,
};
