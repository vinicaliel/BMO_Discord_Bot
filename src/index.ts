import { ExtendedClient } from "./structs/extendedClient";

export * from "colors";

const client = new ExtendedClient();

client.start();

export { client };

client.on("ready", () => {
  console.log("BMO carregado e pronto para atender seus comandos".green);
});

client.on("messageCreate", (message) => {
  if (message.author.id == client.user?.id) return;

  message.reply({
    content: `Olá ${message.author.username}`,
  });
});
