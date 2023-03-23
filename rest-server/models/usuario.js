const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
  google: {
    type: Boolean,
    default: false,
  },
  rol: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, ...usuario } = this.toObject();
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
