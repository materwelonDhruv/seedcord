import { CustomComponent } from '../../Interfaces';

export class PingCommand extends CustomComponent<'command'> {
  constructor() {
    super('command');

    this.component.setName('ping').setDescription('Replies with Pong!');
  }
}
