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
const ActionRowComponentTypes = {
  button: ActionRowBuilder<ButtonBuilder>
};

type ComponentType = keyof typeof ComponentTypes;
type InstantiatedBuilder<B extends ComponentType> = InstanceType<
  (typeof ComponentTypes)[B]
>;
type ActionRowComponentType = keyof typeof ActionRowComponentTypes;
type InstantiatedActionRow<A extends ActionRowComponentType> = InstanceType<
  (typeof ActionRowComponentTypes)[A]
>;

export abstract class CustomComponent<C extends ComponentType> {
  protected component: InstantiatedBuilder<C>;

  constructor(type: C) {
    const ComponentClass = ComponentTypes[type];
    this.component = new ComponentClass() as InstantiatedBuilder<C>;

    if (this.component instanceof EmbedBuilder) {
      this.component.setColor(Constants.botColor);
    }
  }

  get getComponent(): InstantiatedBuilder<C> {
    return this.component;
  }
}

export abstract class CustomActionRow<C extends ActionRowComponentType> {
  protected row: InstantiatedActionRow<C>;

  constructor(type: C) {
    const ComponentClass = ActionRowComponentTypes[type];
    this.row = new ComponentClass() as InstantiatedActionRow<C>;
  }

  get getRow(): InstantiatedActionRow<C> {
    return this.row;
  }
}

export abstract class CustomErrorEmbed extends CustomComponent<'embed'> {
  constructor() {
    super('embed');
    this.component.setTitle('Error');
  }
}
