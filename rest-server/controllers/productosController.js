const { response } = require("express");
const { findCategoria } = require("../helpers/dbValidators");
const { Producto, Categoria } = require("../models");

const setProducto = async (req, res = response) => {
  const { nombre, precio = 0, categoria, descripcion = "" } = req.body;

  try {
    const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() });

    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${nombre}, ya existe.`,
      });
    }

    const categoriaDB = await findCategoria(categoria);

    if (!categoriaDB) {
      return res.status(400).json({
        msg: `El producto ${nombre}, no posee una categoria valida.`,
      });
    }

    const data = {
      precio,
      descripcion: descripcion.toUpperCase(),
      nombre: nombre.toUpperCase(),
      usuario: req.usuario._id,
      categoria: categoriaDB._id,
    };

    const producto = new Producto(data);
    await producto.save();
    return res.status(201).json(producto);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: `El producto no pudo guardarse.`,
    });
  }
};

const getProductos = async (req, res = response) => {
  const { desde = 0, limite = 5 } = req.query;

  const query = { estado: true };

  try {
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate(["usuario", "categoria"]),
    ]);

    return res.json({
      total,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No pudo obtenerse los productos",
    });
  }
};

const getProductoByID = async (req, res = response) => {
  const id = req.params.id;

  try {
    const producto = await Producto.findById(id).populate([
      "categoria",
      "usuario",
    ]);

    if (!producto) {
      return res.status(400).json({
        msg: "No se encontro el producto solicitado",
      });
    }

    return res.status(200).json(producto);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Error al obtener producto solicitado",
    });
  }
};

const updateProducto = async (req, res = response) => {
  const id = req.params.id;
  const { estado, ...data } = req.body;

  try {
    data.nombre = data.nombre.toUpperCase();
    data.descripcion = data.descripcion.toUpperCase();
    data.usuario = req.usuario._id;

    if (data.categoria) {
      const categoriaDB = await findCategoria(data.categoria);
      data.categoria = categoriaDB._id;

      if (!categoriaDB) {
        return res.status(400).json({
          msg: `El producto ${data.nombre}, no posee una categoria valida.`,
        });
      }
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    }).populate(["usuario", "categoria"]);
    return res.json({ producto });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Error al actualizar el producto",
    });
  }
};

const deleteProducto = async (req, res = response) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    return res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "No se pudo eliminar el producto.",
    });
  }
};
module.exports = {
  deleteProducto,
  getProductoByID,
  getProductos,
  setProducto,
  updateProducto,
};
