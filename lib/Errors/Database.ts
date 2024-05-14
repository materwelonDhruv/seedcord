import { CustomErrorEmbed } from '../Interfaces';

// Errors
export class DatabaseConnectionFailure extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseConnectionFailure.prototype);
    this.name = 'DatabaseConnectionFailure';
  }
}

export class DatabaseError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
    this.name = 'DatabaseError';
  }
}

// Embeds
export class DatabaseErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while interacting with the database.`
    );
  }
}
