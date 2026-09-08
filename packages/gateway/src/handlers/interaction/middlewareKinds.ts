import type { InteractionKind } from '@seedcord/core';
import type {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction
} from 'discord.js';

// a kind added to the enum stays out of the middleware surface until someone gives it an entry here
interface InteractionForKind {
    [InteractionKind.Slash]: ChatInputCommandInteraction;
    [InteractionKind.Button]: ButtonInteraction;
    [InteractionKind.Modal]: ModalSubmitInteraction;
    [InteractionKind.StringMenu]: StringSelectMenuInteraction;
    [InteractionKind.UserMenu]: UserSelectMenuInteraction;
    [InteractionKind.RoleMenu]: RoleSelectMenuInteraction;
    [InteractionKind.ChannelMenu]: ChannelSelectMenuInteraction;
    [InteractionKind.MentionableMenu]: MentionableSelectMenuInteraction;
    [InteractionKind.MessageContextMenu]: MessageContextMenuCommandInteraction;
    [InteractionKind.UserContextMenu]: UserContextMenuCommandInteraction;
}

/** The interaction kinds a middleware can filter on. Autocomplete carries no reply target. */
export type MiddlewareKind = keyof InteractionForKind;

/** @internal */
export type InteractionOf<Kind extends MiddlewareKind> = InteractionForKind[Kind];
