import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import * as p from '@clack/prompts';
import { Chalk } from 'chalk';
import merge from 'lodash.merge';

import type { SpawnSyncOptions } from 'node:child_process';

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

  await extractBaseTemplate(templateDir, root, p.spinner());

  const tools = project.tools;

  if (tools.length > 0) await extractTools(root, tools, p.spinner());
  if (project.install) await installPackages(root, packageManager, p.spinner());

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

async function extractTools(root: string, tools: string[], spinner: Spinner): Promise<void> {
  spinner.start(`Adding additional tools`);
  const packagePath = resolve(root, './package.json');
  let packageJson = JSON.parse(await readFile(packagePath, 'utf-8')) as Record<string, unknown>;
  for (const tool of tools) {
    packageJson = installTool(tool, packageJson);
  }
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
  spinner.stop('Added tools');
}

async function extractBaseTemplate(base: string, to: string, spinner: Spinner): Promise<void> {
  spinner.start('extracting base files');
  await mkdir(to, { recursive: true });
  await copyDir(base, to);
  await rename(`${to}/_gitignore`, `${to}/.gitignore`);
  spinner.stop('extracted base files');
}

async function installPackages(root: string, packageManager: string, spinner: Spinner): Promise<void> {
  spinner.start(`Installing via ${packageManager}`);
  await setTimeout(1000);
  await spawnProcess(`${packageManager}`, ['install'], {
    cwd: root
  });
  spinner.stop(`Installed via ${packageManager}`);
}

function installTool(tool: string, packageJson: Record<string, unknown>): Record<string, unknown> {
  const toolObject = additionalTools[tool];
  if (!toolObject) throw new Error(`unable to find tool ${tool}`);
  return merge<Record<string, unknown>, Record<string, unknown>>(packageJson, toolObject);
}

async function spawnProcess(command: string, args: string[], options: SpawnSyncOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const commandProcess = spawn(command, args, options);
    commandProcess.on('error', (err) => reject(err));
    commandProcess.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code} code, output: ${commandProcess.stdout?.read()}`));
    });
  });
}

async function copyDir(src: string, to: string): Promise<void> {
  await mkdir(to, { recursive: true });
  for (const file of await readdir(src)) {
    await copy(resolve(src, file), resolve(to, file));
  }
}

async function copy(src: string, to: string): Promise<void> {
  const isDir = (await stat(src)).isDirectory();
  if (isDir) {
    await copyDir(src, to);
  } else {
    await copyFile(src, to);
  }
}

void init();
