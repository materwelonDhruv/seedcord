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

abstract class CustomBase<C> {
  protected component: C;

  constructor(ComponentClass: new () => C) {
    this.component = new ComponentClass();
  }

  get getComponent(): C {
    return this.component;
  }
}

export abstract class CustomComponent<
  C extends ComponentType
> extends CustomBase<InstantiatedBuilder<C>> {
  constructor(type: C) {
    const ComponentClass = ComponentTypes[type] as unknown;
    super(ComponentClass as new () => InstantiatedBuilder<C>);

    if (this.component instanceof EmbedBuilder) {
      this.component.setColor(Constants.botColor);
    }
  }
}

export abstract class CustomActionRow<
  C extends ActionRowComponentType
> extends CustomBase<InstantiatedActionRow<C>> {
  constructor(type: C) {
    const ComponentClass = ActionRowComponentTypes[type] as unknown;
    super(ComponentClass as new () => InstantiatedActionRow<C>);
  }
}

export abstract class CustomErrorEmbed extends CustomComponent<'embed'> {
  constructor() {
    super('embed');
    this.component.setTitle('Error');
  }
}
