import * as crypto from 'node:crypto';

import { Logger } from '@seedcord/services';
import { Envapt } from 'envapt';

import { CustomError } from '../../interfaces/Components';
import { DatabaseError } from '../errors/Database';

import type { Core } from '../../interfaces/Core';
import type { Nullable } from '@seedcord/types';
import type { EmbedBuilder, Guild, User } from 'discord.js';
import type { UUID } from 'node:crypto';

/**
 * Utility class for standardized error handling and response generation.
 */
export class ErrorHandlingUtils {
    private static readonly logger = new Logger('Errors');

    /**
     * Processes an error and extracts the standardized response, if available.
     *
     * Handles different error types (CustomError, DatabaseError) with appropriate
     * logging, side effects, and user-facing error messages.
     *
     * @param error - The error to process
     * @param core - The core framework instance
     * @param guild - The guild where the error occurred (if any)
     * @param user - The user who triggered the error (if any)
     * @returns Object containing UUID and formatted error response embed
     */
    public static extractErrorResponse(
        error: Error,
        core: Core,
        guild: Nullable<Guild>,
        user: Nullable<User>
    ): { uuid: UUID; response: EmbedBuilder } {
        const uuid = crypto.randomUUID();

        if (error instanceof CustomError) {
            if (error instanceof DatabaseError) {
                core.effects.emit('unknownException', { uuid, error, guild, user });

                this.logger.error(`DatabaseError: ${error.uuid}`);
            } else if (error.emit) {
                this.logger.error(`${error.name}: ${error.message}`, error);
            }

            return {
                uuid,
                response: error.response
            };
        }

        const showStack = core.config.bot.errorStack;
        if (showStack) this.logger.error(uuid, error);
        else this.logger.error(`${uuid} | ${error.message}`);

        core.effects.emit('unknownException', { uuid, error, guild, user });

        return {
            uuid,
            response: new GenericError(uuid).response
        };
    }
}

/**
 * Generic error shown to users when an unknown error occurs
 *
 * Set an environment variable called `DEVELOPER_DISCORD_USERNAME` in your `.env` file to customize the contact name.
 */
export class GenericError extends CustomError {
    @Envapt('DEVELOPER_DISCORD_USERNAME')
    private readonly developerUsername: string = 'the developer';

    constructor(private readonly uuid: UUID) {
        super('An unknown error occurred');

        this.response
            .setTitle('Error')
            .setDescription(
                `An unknown error occurred. Please reach out to ${this.developerUsername} with a way to reproduce the error and the following:\n` +
                    `### UUID: \`${this.uuid}\``
            );
    }
}
