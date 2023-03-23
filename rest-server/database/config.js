const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS);
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error en la conexión de BD");
  }
};

module.exports = {
  dbConnection,
};
