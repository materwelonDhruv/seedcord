# seedcord

**Welcome to seedcord**, a TypeScript-based Discord bot template created by materwelon. Designed for developers looking to build an object-oriented Discord bot, seedcord follows good design patterns, ensuring robustness and scalability.

## Features

- **TypeScript**: Employs the latest TypeScript for strong typing and maintainability.
- **Modular Design**: The codebase is structured into separate directories, each with a specific purpose, enhancing readability and extendibility.
- **Object-Oriented Programming**: Utilizes OOP principles for clear modular structures and reusability.
- **Design Patterns**: Includes Dependency Injection, Singleton, Factory, Command, Observer, and Middleware Patterns for efficient management and dynamic component generation.
- **MongoDB Integration**: Comes with MongoDB setup for robust data handling using Mongoose.
- **Environment-Specific Configuration**: Separate configuration files for development and production environments.
- **Docker Support**: Includes a basic Docker configuration for containerized application management.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version)
- TypeScript
- pnpm (recommended)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/seedcord.git
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Set up MongoDB**:
   - Define schemas in `db/Models`.
   - Implement CRUD operations in middleware classes within `db/Middleware` for atomic interactions.
4. **Environment Setup**:
   - Create `.env.development` and `.env.production` based on the provided templates:
     ```
     MONGODB_URI=<your_mongodb_uri>
     DB_NAME=<your_database_collection_name>
     BOT_TOKEN=<your_discord_bot_token>
     ```

## Usage

- **Development**:

  - Start the development server:
    ```bash
    npm run dev
    ```
  - **Testing**:
    - Create a `Test` directory in the main directory and add a `test.ts` file for your tests.
    - Run tests using:
      ```bash
      pnpm run test
      ```

- **Production**:
  ```bash
  npm run start:prod
  ```

## Contributing

Contributions are welcome! Whether it's feature enhancements, bug fixes, or performance improvements, we invite you to fork the project and submit pull requests. You can also open issues if you find bugs or have feature requests. Please adhere to the established code style and document all changes.

## License

seedcord.ts is licensed under the MIT License, allowing modification, distribution, private use, and commercial use, provided the original copyright and license notice are included.

## Contact

- Discord: materwelon
- Twitter: @materwelon2002
- Email: materwelondhruv@gmail.com
