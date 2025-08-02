import type { CoreBot } from '../../core/CoreBot';
import type { TypedConstructor } from '../../core/library/types/Miscellaneous';
import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  Events,
  ModalSubmitInteraction
} from 'discord.js';

export type ValidInteractionTypes =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | ModalSubmitInteraction
  | AutocompleteInteraction
  | AnySelectMenuInteraction;

export type ValidNonInteractionTypes = ClientEvents[Exclude<keyof ClientEvents, Events.InteractionCreate>];
export type ValidEventTypes = ValidInteractionTypes | ValidNonInteractionTypes;

export type Repliables = Exclude<ValidInteractionTypes, AutocompleteInteraction>;

export type RepliableInteractionHandler = InteractionHandler<Repliables> | InteractionMiddleware<Repliables>;

export interface Handler {
  execute(): Promise<void>;
}

export interface WithChecks {
  runChecks(): Promise<void>;
}

interface HandlerWithChecks extends WithChecks, Handler {}

abstract class BaseHandler<ValidEvent extends ValidEventTypes> implements Handler {
  protected checkable = false;
  protected break = false;
  protected errored = false;
  protected event: ValidEvent;

  protected constructor(
    event: ValidEvent,
    public core: CoreBot
  ) {
    this.event = event;
  }

  abstract execute(): Promise<void>;

  public hasChecks(): this is HandlerWithChecks {
    return this.checkable;
  }

  public hasErrors(): boolean {
    return this.errored;
  }

  public setErrored(): void {
    this.errored = true;
  }

  public shouldBreak(): boolean {
    return this.break;
  }

  public getEvent(): ValidEvent {
    return this.event;
  }
}

/**
 * All interactions with the bot including Handlers and what those handlers do or pass to other services should extend this class.
 * This class implements ICheckable when the decorator Checkable is used on the class.
 * @implements Handler
 * @template Repliable - A type that extends one of the ValidEventTypes. Can add more types to the ValidEventTypes union type if needed.
 */
export abstract class InteractionHandler<Repliable extends Repliables>
  extends BaseHandler<Repliable>
  implements Handler
{
  constructor(event: Repliable, core: CoreBot) {
    super(event, core);
  }
}

export abstract class InteractionMiddleware<Repliable extends Repliables>
  extends BaseHandler<Repliable>
  implements Handler
{
  constructor(event: Repliable, core: CoreBot) {
    super(event, core);
  }
}

/**
 * All non-interaction events with the bot including Handlers and what those handlers do or pass to other services should extend this class.
 * This class implements ICheckable when the decorator Checkable is used on the class.
 * @implements Handler
 * @template Repliable - A type that extends one of the ValidEventTypes. Can add more types to the ValidEventTypes union type if needed.
 */
export abstract class EventHandler<Repliable extends keyof ClientEvents>
  extends BaseHandler<ClientEvents[Repliable]>
  implements Handler
{
  constructor(event: ClientEvents[Repliable], core: CoreBot) {
    super(event, core);
  }
}

// A generic type alias for a handler constructor
export type HandlerConstructor = TypedConstructor<typeof InteractionHandler>;

export type MiddlewareConstructor = TypedConstructor<typeof InteractionMiddleware>;

export type EventHandlerConstructor = TypedConstructor<typeof EventHandler>;
