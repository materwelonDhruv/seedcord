import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as p from '@clack/prompts';
import { Chalk } from 'chalk';
import merge from 'lodash.merge';

interface Spinner {
  start: (msg?: string) => void;
  stop: (msg?: string, code?: number) => void;
  message: (msg?: string) => void;
}

const colors = new Chalk();
const packageManager = fetchPackageManager() ?? 'npm';

const prompts: p.PromptGroup<{
  path: string | symbol;
  tools: string[] | symbol;
  install: boolean | symbol;
}> = {
  path: () =>
    p.text({
      message: 'Where should we create your project?',
      placeholder: 'seedcord-project',
      validate: (value) => {
        if (!value) return 'Please enter a path.';
        // TODO: add prompt for overwriting directory
        if (existsSync(value)) return 'folder already exists';
        return undefined;
      }
    }),
  tools: () =>
    p.multiselect({
      message: 'Select additional tools.',
      initialValues: ['prettier'],
      required: false,
      options: [
        // TODO: add more tools
        { value: 'prettier', label: 'Prettier', hint: 'recommended' }
      ]
    }),
  install: () =>
    p.confirm({
      message: `Install dependencies with ${packageManager}?`,
      initialValue: false
    })
};

const additionalTools: Record<string, Record<string, unknown>> = {
  prettier: {
    scripts: {
      fmt: "prettier --write 'src/**/*.{ts,tsx,json,md}' --cache",
      'fmt:check': "prettier --check 'src/**/*.{ts,tsx,json,md}' --cache"
    },
    devDependencies: {
      prettier: '^3.6.2'
    }
  }
};

async function init(): Promise<void> {
  p.updateSettings({
    aliases: {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right'
    }
  });

  p.intro(`${colors.bgCyan(colors.black(' seedcord wizard '))}`);

  const project = await p.group(prompts, {
    onCancel: () => {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
  });
  const root = join(process.cwd(), formatDir(project.path));
  const templateDir = resolve(fileURLToPath(import.meta.url), '../../template');

  extractBaseTemplate(templateDir, root);

  const tools = project.tools;

  if (tools.length > 0) extractTools(root, tools, p.spinner());
  if (project.install) installPackages(root, packageManager, p.spinner());

  const nextSteps =
    `cd ${project.path}\n` +
    `${project.install ? '' : `${packageManager} install\n`}` +
    `fill .env.example and rename it to .env\n` +
    `${packageManager} dev`;

  p.note(nextSteps, 'Next steps.');
  p.outro(`Problems? ${colors.underline(colors.cyan('https://github.com/materwelondhruv/seedcord/issues'))}`);
}

function formatDir(path: string): string {
  return path.trim().replace(/\/+$/g, '');
}

function fetchPackageManager(): string | undefined {
  const agent = process.env.npm_config_user_agent;
  return agent?.split(' ')[0]?.split('/')[0];
}

function extractTools(root: string, tools: string[], spinner: Spinner): void {
  // TODO: actually make spinner work, it requires things to be async
  spinner.start(`Adding additional tools`);
  const packagePath = resolve(root, './package.json');
  let packageJson = JSON.parse(readFileSync(packagePath, 'utf-8')) as Record<string, unknown>;
  for (const tool of tools) {
    const toolObject = additionalTools[tool];
    if (!toolObject) throw new Error(`unable to find tool ${tool}`);
    packageJson = merge<Record<string, unknown>, Record<string, unknown>>(packageJson, toolObject);
  }
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
  spinner.stop();
}

function extractBaseTemplate(base: string, to: string): void {
  mkdirSync(to, { recursive: true });
  copyDir(base, to);
  renameSync(`${to}/_gitignore`, `${to}/.gitignore`);
}

function installPackages(root: string, packageManager: string, spinner: Spinner): void {
  spinner.start(`Installing via ${packageManager}`);
  spawnSync(`${packageManager}`, ['install'], {
    cwd: root
  });
  spinner.stop(`Installed via ${packageManager}`);
}

function copyDir(src: string, to: string): void {
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(src)) {
    copy(resolve(src, file), resolve(to, file));
  }
}

function copy(src: string, to: string): void {
  const isDir = statSync(src).isDirectory();
  if (isDir) {
    copyDir(src, to);
  } else {
    copyFileSync(src, to);
  }
}

void init();
