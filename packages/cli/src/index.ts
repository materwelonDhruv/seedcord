import { program } from '@commander-js/extra-typings';

import { availableComponents, createComponent } from './create';
import { scaffoldProject } from './scaffold';
import { colors } from './utils';

program
  .name('@seedcord/cli')
  .description('cli for scaffolding seedcord projects and adding components (coming soon)')
  // TODO: maybe get version from package.json or remove it fully
  .version('0.0.0');

program
  .command('scaffold')
  .description('scaffold a seedcord project')
  // TODO: add cli options
  .action(async () => {
    await scaffoldProject();
  });

program
  .command('create')
  .description('create a template component')
  .argument('<path>', 'path for copying template component to')
  .addHelpText('after', `\nAvailable templates: ${colors.cyan(availableComponents.join(', '))}`)
  // TODO: create both handler and component
  .argument('[name]', 'name of created component', 'newCommand')
  .option('-t --template <TYPE>', 'select template', 'mock')
  .action(async (path, name, args) => {
    const template = args.template;
    await createComponent(path, name, template);
  });

program.parse();
