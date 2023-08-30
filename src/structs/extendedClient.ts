import {
  Client,
  Partials,
  IntentsBitField,
  BitFieldResolvable,
  GatewayIntentsString,
  Collection,
  ApplicationCommandDataResolvable,
  ClientEvents,
} from "discord.js";
import dotenv from "dotenv";
import {
  CommandType,
  componentButton,
  componentModal,
  componentSelect,
} from "./types/commands";
import fs from "fs";
import path from "path";
import { EventType } from "./types/Events";
dotenv.config();

const fileCondition = (fileName: string) =>
  fileName.endsWith(".ts") || fileName.endsWith(".js");

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: componentButton = new Collection();
  public selects: componentSelect = new Collection();
  public modal: componentModal = new Collection();

  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public start() {
    this.registerEvents();
    this.registerModules();
    this.login(process.env.BOT_TOKEN);
  }

  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        console.log("slash commands defined".green);
      })
      .catch((err) => {
        console.log("something went wrong...".red);
      });
  }

  private registerModules() {
    const SlashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandPath = path.join(__dirname, "..", "commands");
    const fileCondition = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".js");

    fs.readdirSync(commandPath).forEach((local) => {
      fs.readdirSync(commandPath + `/${local}/`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const command: CommandType = (
            await import(`../commands/${local}/${fileName}`)
          )?.default;
          const { name, buttons, select, modal } = command;

          if (name) {
            this.commands.set(name, command);
            SlashCommands.push(command);

            if (buttons)
              buttons.forEach((run, key) => this.buttons.set(key, run));
            if (select)
              select.forEach((run, key) => this.selects.set(key, run));
            if (modal) modal.forEach((run, key) => this.modal.set(key, run));
          }
        });
    });

    this.on("ready", () => this.registerCommands(SlashCommands));
  }

  private registerEvents() {
    const eventsPath = path.join(__dirname, "..", "events");

    fs.readdirSync(eventsPath).forEach((local) => {
      fs.readdirSync(`${eventsPath}/${local}`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const { name, once, run }: EventType<keyof ClientEvents> = (
            await import(`../events/${local}/${fileName}`)
          )?.default;

          try {
              if (name) (once) ? this.once(name , run) : this.on(name , run)
           } catch (error) {
            console.log('ocorreu um erro ' + error)
          }
        });
    });
  }
}
