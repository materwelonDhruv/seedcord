import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  EmbedBuilder,
  MentionableSelectMenuBuilder,
  ModalBuilder,
  RoleSelectMenuBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder
} from 'discord.js';
import { Constants } from '..';

const ComponentTypes = {
  command: SlashCommandBuilder,
  embed: EmbedBuilder,
  button: ButtonBuilder,
  menu_string: StringSelectMenuBuilder,
  menu_option_string: StringSelectMenuOptionBuilder,
  menu_role: RoleSelectMenuBuilder,
  menu_mentionable: MentionableSelectMenuBuilder,
  menu_channel: ChannelSelectMenuBuilder,
  menu_user: UserSelectMenuBuilder,
  modal: ModalBuilder
};
const ActionRowComponentTypes = {
  button: ActionRowBuilder<ButtonBuilder>,
  menu_string: ActionRowBuilder<StringSelectMenuBuilder>,
  menu_role: ActionRowBuilder<RoleSelectMenuBuilder>,
  menu_mentionable: ActionRowBuilder<MentionableSelectMenuBuilder>,
  menu_channel: ActionRowBuilder<ChannelSelectMenuBuilder>,
  menu_user: ActionRowBuilder<UserSelectMenuBuilder>
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
      this.component.setColor(Constants.BOT_COLOR);
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
