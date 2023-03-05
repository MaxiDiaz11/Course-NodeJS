const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  const {api = "apiKey"} = req.query;
  res.status(200).json({
    ok: true,
    msg: "get API - Controller",
    api,
  });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;

  res.status(200).json({
    ok: true,
    msg: "post API - Controller",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  res.status(200).json({
    ok: true,
    msg: "put API - Controller",
    id,
  });
};

const usuariosPatch = (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "patch API - Controller",
  });
};

const usuariosDelete = (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "delete API - Controller",
  });
};

module.exports = {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
};
