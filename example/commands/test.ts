import { Command } from '../../src/Command.ts';
import type { CommandContext } from '../../src/CommandContext.ts';

export default class TestCommand extends Command {
  override name = 'test';
  
  override execute(ctx: CommandContext) {
    ctx.reply('This is a test.');

    ctx.channel.say('This also works.');
  }
}