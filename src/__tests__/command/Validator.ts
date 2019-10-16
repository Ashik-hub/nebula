import Discord from 'discord.js';
import { Command, Addon, Validator, ValidationResults } from '../..';

export default class ValidatorCommand extends Command {
  constructor(addon: Addon) {
    super(addon, {
      name: 'v',
      schema: {
        mention: Validator.string().user(),
      },
    });
  }

  public async willDispatch(message: Discord.Message) {
    message.channel.send('Test suites for Validator');
  }

  public async didDispatch(message: Discord.Message, { mention }: ValidationResults) {
    message.channel.send(`Mention: ${mention}`);
  }
}
