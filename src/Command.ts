import type { ChatMessage } from '@twurple/chat';
import type { CommandContext } from './CommandContext.ts';

export interface CommandOptions {
  name: string;
  args?: string[];
  adminOnly?: boolean;
}

export class Command implements CommandOptions {
  static meta?: CommandOptions;

  name: string = '';
  args?: string[];
  modOnly?: boolean = false;

  onError(_ctx: CommandContext, _error: Error): unknown | Promise<unknown> {
    return;
  }

  execute(_ctx: CommandContext): unknown | Promise<unknown> {
    return;
  }
}

export interface ParsedCommand {
  name: string;
  args: string[];
  argString: string;
}

export const parseCommand = (
  msg: ChatMessage,
  prefix: string,
): ParsedCommand | undefined => {
  const content = msg.text.slice(prefix.length);
  const args = content.split(/\s/);

  const name = args.shift();
  if (name === undefined) return;
  const argString = content.slice(name.length).trim();

  return { name, args, argString };
}