const path = require("path");
const fs = require("fs");
const { response } = require("express");
const cloudinary = require("cloudinary").v2;
const { Usuario, Producto } = require("../models");
const { subirArchivo } = require("../helpers/subir-archivos");

// Configuration
cloudinary.config(process.env.CLOUDINARY_URL);

const setFiles = async (req, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files);
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const updateImage = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con este ID",
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un producto con este ID",
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Falta esta validación",
      });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);

  modelo.img = nombre;

  await modelo.save();

  return res.json(modelo);
};

const updateImageWithCloudinary = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con este ID",
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un producto con este ID",
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Falta esta validación",
      });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { secure_url } = await cloudinary.uploader.upload(
    req.files.archivo.tempFilePath
  );

  // const nombre = await subirArchivo(req.files, undefined, coleccion);

  modelo.img = secure_url;

  await modelo.save();

  return res.json(modelo);
};

const getImage = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;
  let pathErrorImg = path.join(__dirname, "../assets", "no-image.jpg");

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: "No existe un usuario con este ID",
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.sendFile(pathErrorImg);
      }
      break;

    default:
      return res.sendFile(pathErrorImg);
  }

  if (modelo.img) {
    const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }
  return res.sendFile(pathErrorImg);
};

module.exports = {
  getImage,
  setFiles,
  updateImage,
  updateImageWithCloudinary,
};
