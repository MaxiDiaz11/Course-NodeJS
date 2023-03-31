const { response, request } = require("express");
const { Categoria } = require("../models");

const setCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  try {
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${nombre}, ya existe.`,
      });
    }

    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);
    await categoria.save();

    return res.status(201).json(categoria);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: `La categoria no pudo guardarse.`,
    });
  }
};

const getCategorias = async (req = request, res = response) => {
  try {
    const { desde = 0, limite = 5 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario"),
    ]);

    res.status(200).json({ total, categorias });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No pudo obtenerse las categorias",
    });
  }
};

const getCategoriaById = async (req = request, res = response) => {
  try {
    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate("usuario");

    if (!categoria) {
      res.status(400).json({
        msg: "No se encontro la categoria solicitada.",
      });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No pudo obtenerse la categoria.",
    });
  }
};

const updateCategoria = async (req = request, res = response) => {
  try {
    const id = req.params.id;

    let { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({ categoria });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No se pudo actualizar la categoria.",
    });
  }
};

const deleteCategoria = async (req = request, res = response) => {
  const id = req.params.id;
  const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

  res.status(200).json({
    categoria,
  });
};

module.exports = {
  deleteCategoria,
  getCategoriaById,
  getCategorias,
  setCategoria,
  updateCategoria,
};
