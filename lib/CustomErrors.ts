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
