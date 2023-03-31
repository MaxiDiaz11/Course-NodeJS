const { request, response } = require("express");
const JWT = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(400).json({
      msg: "No hay Token en la petición.",
    });
  }

  try {
    const { uid } = JWT.verify(token, process.env.SECRET_KEY);

    //usuario que corresponde al uid
    const usuario = await Usuario.findById({ _id: uid });

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en BD.",
      });
    }

    //verificar si el uid tiene estado = true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado en false.",
      });
    }

    req.usuario = usuario;

    req.uid = uid;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no válido.",
    });
  }
};

module.exports = {
  validateJWT,
};
