import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import { Constants } from '..';

const ComponentTypes = {
  command: SlashCommandBuilder,
  embed: EmbedBuilder,
  button: ButtonBuilder
};
type ComponentType = keyof typeof ComponentTypes;

const ActionRowComponentTypes = {
  button: ActionRowBuilder<ButtonBuilder>
};

type ActionRowComponentType = keyof typeof ActionRowComponentTypes;

export abstract class CustomComponent<T extends ComponentType> {
  protected component: InstanceType<(typeof ComponentTypes)[T]>;

  constructor(type: T) {
    const ComponentClass = ComponentTypes[type];
    this.component = new ComponentClass() as InstanceType<
      (typeof ComponentTypes)[T]
    >;

    if (this.component instanceof EmbedBuilder) {
      this.component.setColor(Constants.botColor);
    }
  }

  get getComponent(): InstanceType<(typeof ComponentTypes)[T]> {
    return this.component;
  }
}

export abstract class CustomActionRow<T extends ActionRowComponentType> {
  protected row: InstanceType<(typeof ActionRowComponentTypes)[T]>;

  constructor(type: T) {
    const ComponentClass = ActionRowComponentTypes[type];
    this.row = new ComponentClass() as InstanceType<
      (typeof ActionRowComponentTypes)[T]
    >;
  }

  get getRow(): InstanceType<(typeof ActionRowComponentTypes)[T]> {
    return this.row;
  }
}

export abstract class CustomErrorEmbed extends CustomComponent<'embed'> {
  constructor() {
    super('embed');
    this.component.setTitle('Error');
  }
}
