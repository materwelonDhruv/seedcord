import { CustomErrorEmbed } from '../../../Interfaces';

export class GenericErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while processing this request. Please report this to materwelon`
    );
  }
}

export class CannotInteractWithBotEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(`You cannot interact with the bot.`);
  }
}

export class MissingPermissionsEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `You are missing the required permissions for this action.`
    );
  }
}

export class DatabaseErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while interacting with the database.`
    );
  }
}