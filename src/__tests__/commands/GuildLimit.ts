import { Command, Addon, CommandMessage } from '../..';

export default class GuildLimitCommand extends Command {
  constructor(addon: Addon) {
    super(addon, {
      name: 'g',
      limit: {
        time: 5000,
        scope: 'guild',
      },
    });
  }

  protected async willDispatch(message: CommandMessage) {
    message.send('Test suites for guild limit');
  }

  protected async didDispatch(message: CommandMessage) {
    message.send(
      `You have ${this.options.limit.bucket -
        this.usage.get(message.guild.id)![0]} time(s) left before cooling down. Scope: Guild`,
    );
  }
}
