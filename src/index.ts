import { ExtendedClient } from "./structs/extendedClient";
export * from "colors";
import config from "./structs/config.json";
import fs from 'fs'
import path from 'path'

const client = new ExtendedClient();

client.start();



export { client, config };

client.on("ready", () => {
  console.log("BMO carregado e pronto para atender seus comandos".green);
});
