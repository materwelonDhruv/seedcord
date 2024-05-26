import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder
} from 'discord.js';

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type _Array<N extends number, T, R extends unknown[]> = R['length'] extends N
  ? R
  : _Array<N, T, [T, ...R]>;

export type FixedLengthArray<N extends number, T> = N extends N
  ? number extends N
    ? T[]
    : _Array<N, T, []>
  : never;

export type Nullish<T = null> = T extends null
  ? null | undefined
  : T | null | undefined;

export type MessageContent = AtLeastOne<{
  content: string;
  embeds: EmbedBuilder[];
  components: [ActionRowBuilder<MessageActionRowComponentBuilder>];
}>;
