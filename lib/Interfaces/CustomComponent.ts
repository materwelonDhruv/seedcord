import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder
} from 'discord.js';
import { Constants } from '..';

const ComponentTypes = {
  command: SlashCommandBuilder,
  embed: EmbedBuilder,
  button: ButtonBuilder,
  menu_string: StringSelectMenuBuilder,
  menu_option_string: StringSelectMenuOptionBuilder,
  modal: ModalBuilder
};
const ActionRowComponentTypes = {
  button: ActionRowBuilder<ButtonBuilder>,
  menu_string: ActionRowBuilder<StringSelectMenuBuilder>,
  modal: ActionRowBuilder<ModalActionRowComponentBuilder>
};

const ModalTypes = {
  text: TextInputBuilder
};

type ComponentType = keyof typeof ComponentTypes;
type InstantiatedBuilder<B extends ComponentType> = InstanceType<
  (typeof ComponentTypes)[B]
>;

type ActionRowComponentType = keyof typeof ActionRowComponentTypes;
type InstantiatedActionRow<A extends ActionRowComponentType> = InstanceType<
  (typeof ActionRowComponentTypes)[A]
>;

type ModalType = keyof typeof ModalTypes;
type InstantiatedModal<M extends ModalType> = InstanceType<
  (typeof ModalTypes)[M]
>;

abstract class CustomBase<C> {
  protected component: C;

  constructor(ComponentClass: new () => C) {
    this.component = new ComponentClass();
  }

  abstract get getComponent():
    | InstantiatedBuilder<ComponentType>
    | InstantiatedActionRow<ActionRowComponentType>;
}

export abstract class CustomComponent<
  C extends ComponentType
> extends CustomBase<InstantiatedBuilder<C>> {
  constructor(type: C) {
    const ComponentClass = ComponentTypes[type] as unknown;
    super(ComponentClass as new () => InstantiatedBuilder<C>);

    if (this.component instanceof EmbedBuilder) {
      this.component.setColor(Constants.BOT_COLOR);
    }
  }

  get getComponent(): InstantiatedBuilder<C> {
    return this.component;
  }
}

export abstract class CustomActionRow<
  C extends ActionRowComponentType
> extends CustomBase<InstantiatedActionRow<C>> {
  constructor(type: C) {
    const ComponentClass = ActionRowComponentTypes[type] as unknown;
    super(ComponentClass as new () => InstantiatedActionRow<C>);
  }

  get getComponent(): InstantiatedActionRow<C> {
    return this.component;
  }
}

class ModalRow<M extends ModalType> extends CustomActionRow<'modal'> {
  constructor(component: InstantiatedModal<M>) {
    super('modal');

    this.component.addComponents(component);
  }
}

export abstract class CustomModalField<M extends ModalType> extends CustomBase<
  InstantiatedModal<M>
> {
  constructor(type: M) {
    const ComponentClass = ModalTypes[type] as unknown;
    super(ComponentClass as new () => InstantiatedModal<M>);
  }

  get getComponent(): InstantiatedActionRow<'modal'> {
    return new ModalRow<M>(this.component).getComponent;
  }
}

export abstract class CustomErrorEmbed extends CustomComponent<'embed'> {
  constructor() {
    super('embed');
    this.component.setTitle('Error');
  }
}
