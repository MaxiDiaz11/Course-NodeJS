const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerBD();
  }

  get HistorialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }

  get getParamsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY || "",
      limit: 5,
      language: "es",
    };
  }

  get getParamsOpenWather() {
    return {
      appid: process.env.OPENWEATHER || "",
      units: "metric",
      lang: "es",
    };
  }

  getCiudad = async (lugar = "") => {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.getParamsMapBox,
      });

      const response = await instance.get();

      return response.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log("error");
      return [];
    }
  };

  getTemperatura = async (lat, lng) => {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}`,
        params: this.getParamsOpenWather,
      });

      const response = await instance.get();

      return response.data.main;
    } catch (error) {
      console.log("error");
      return [];
    }
  };

  setHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLowerCase())) return;

    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(lugar.toLowerCase());

    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerBD() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
