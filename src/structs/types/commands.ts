import {
  ApplicationCommandData,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { ExtendedClient } from "../extendedClient";

interface CommandProps {
  client: ExtendedClient;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

export type componentButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;
export type componentSelect = Collection<
  string,
  (interaction: StringSelectMenuInteraction) => any
>;
export type componentModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;

interface CommandComponents {
  buttons?: componentButton;
  select?: componentSelect;
  modal?: componentModal;
}

export type CommandType = ApplicationCommandData &
  CommandComponents & {
    run(props: CommandProps): any;
  };

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options)
  }
}
