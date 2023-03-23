const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardar
  await usuario.save();

  res.status(200).json({
    ok: true,
    msg: "post API - Controller",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...rest } = req.body;

  if (password) {
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest);

  res.status(200).json({
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "patch API - Controller",
  });
};

const usuariosDelete = async (req, res = response) => {
  const id = req.params.id;

  //Borrado fisico
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.status(200).json({
    usuario,
  });
};

module.exports = {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
};
