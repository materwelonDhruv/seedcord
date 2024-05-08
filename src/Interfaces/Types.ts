import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder
} from 'discord.js';
import { AtLeastOne } from '../../lib';

export type MessageContent = AtLeastOne<{
  content: string;
  embeds: EmbedBuilder[];
  components: [ActionRowBuilder<MessageActionRowComponentBuilder>];
}>;
