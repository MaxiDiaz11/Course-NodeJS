const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/JWTGenerate");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar email
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos. - correo",
      });
    }

    //Verificar usuario
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos. estado:false",
      });
    }

    //Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos. password",
      });
    }

    //JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

module.exports = {
  login,
};
