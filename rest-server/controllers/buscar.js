const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Producto, Categoria } = require("../models");

const coleccionesPermitidas = ["usuarios", "productos", "categorias", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const isMongoID = isValidObjectId(termino);

  if (isMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex, estado: true }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({
    results: usuarios,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  const isMongoID = isValidObjectId(termino);

  if (isMongoID) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const productos = await Producto.find({ nombre: regex }).populate(
    "categoria",
    "nombre"
  );
  res.json({
    results: productos,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
  const isMongoID = isValidObjectId(termino);

  if (isMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");

  const categorias = await Categoria.find({
    $or: [{ nombre: regex }],
  });
  res.json({
    results: categorias,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;

    case "categorias":
      buscarCategorias(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "No existe la busqueda para este caso",
      });
  }
};

module.exports = { buscar };
