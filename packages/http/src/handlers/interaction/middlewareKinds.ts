import type { SelectInteraction } from './components/SelectMenuHandler';
import type { InteractionKind } from '@seedcord/core';
import type {
    APIChatInputApplicationCommandInteraction,
    APIMessageApplicationCommandInteraction,
    APIMessageChannelSelectInteractionData,
    APIMessageComponentButtonInteraction,
    APIMessageMentionableSelectInteractionData,
    APIMessageRoleSelectInteractionData,
    APIMessageStringSelectInteractionData,
    APIMessageUserSelectInteractionData,
    APIModalSubmitInteraction,
    APIUserApplicationCommandInteraction
} from 'discord-api-types/v10';

// a kind added to the enum stays out of the middleware surface until someone gives it an entry here
interface InteractionForKind {
    [InteractionKind.Slash]: APIChatInputApplicationCommandInteraction;
    [InteractionKind.Button]: APIMessageComponentButtonInteraction;
    [InteractionKind.Modal]: APIModalSubmitInteraction;
    [InteractionKind.StringMenu]: SelectInteraction<APIMessageStringSelectInteractionData>;
    [InteractionKind.UserMenu]: SelectInteraction<APIMessageUserSelectInteractionData>;
    [InteractionKind.RoleMenu]: SelectInteraction<APIMessageRoleSelectInteractionData>;
    [InteractionKind.ChannelMenu]: SelectInteraction<APIMessageChannelSelectInteractionData>;
    [InteractionKind.MentionableMenu]: SelectInteraction<APIMessageMentionableSelectInteractionData>;
    [InteractionKind.MessageContextMenu]: APIMessageApplicationCommandInteraction;
    [InteractionKind.UserContextMenu]: APIUserApplicationCommandInteraction;
}

/** The interaction kinds a middleware can filter on. Autocomplete carries no reply target. */
export type MiddlewareKind = keyof InteractionForKind;

/** @internal */
export type InteractionOf<Kind extends MiddlewareKind> = InteractionForKind[Kind];
