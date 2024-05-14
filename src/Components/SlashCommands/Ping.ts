import { CustomComponent } from '../../../lib';

export class PingCommand extends CustomComponent<'command'> {
  constructor() {
    super('command');

    this.component.setName('ping').setDescription('Replies with Pong!');
  }
}
