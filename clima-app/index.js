require("dotenv").config();
const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();

  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //mostrar mensajes
        const terminoBusqueda = await leerInput("Ciudad: ");

        //buscar los lugares
        const lugares = await busquedas.getCiudad(terminoBusqueda);

        //seleccionar el lugar
        const id = await listarLugares(lugares);

        if (id === "0") continue;

        const lugarSeleccionado = lugares.find((lugar) => lugar.id === id);

        //Guardar en DB
        busquedas.setHistorial(lugarSeleccionado.nombre);

        const { nombre, lat, lng } = lugarSeleccionado;

        //Clima
        const clima = await busquedas.getTemperatura(lat, lng);

        const { temp, temp_min, temp_max } = clima;

        //Mostrar resultados
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", nombre);
        console.log("Lat: ", lat);
        console.log("Lng: ", lng);
        console.log("Temperatura: ", temp);
        console.log("Min: ", temp_min);
        console.log("Max: ", temp_max);
        break;

      case 2:
        busquedas.HistorialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} - ${lugar}`);
        });

      default:
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
