import { UnhandledAutocomplete } from '#handlers/defaults/UnhandledAutocomplete';
import { UnhandledRepliable } from '#handlers/defaults/UnhandledRepliable';

import { BanAutocomplete } from './discovery/fixtures/handlers/BanAutocomplete';
import { ConfirmButton } from './discovery/fixtures/handlers/ConfirmControls';
import { PingCommand } from './discovery/fixtures/handlers/PingCommand';
import { UserInfoMenu } from './discovery/fixtures/handlers/UserInfoMenu';

import type { Manifest } from '#src/manifest/Manifest';

// a generated manifest lists concrete classes with no cast available to it
export const handlers: Manifest['handlers'] = [
    PingCommand,
    BanAutocomplete,
    ConfirmButton,
    UserInfoMenu,
    UnhandledRepliable,
    UnhandledAutocomplete
];
