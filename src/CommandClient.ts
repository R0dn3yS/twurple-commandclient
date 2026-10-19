import { ChatClient, type ChatMessage, type ChatClientOptions,  } from '@twurple/chat';
import { ApiClient } from '@twurple/api';
import { CommandsManager } from './CommandsManager.ts';
import { parseCommand } from './Command.ts';
import { EventEmitter } from 'node:events';
import type { CommandContext } from './CommandContext.ts';

export interface CommandClientOptions extends ChatClientOptions {
  prefix: string;
}

export class CommandClient extends ChatClient {
  public commands: CommandsManager = new CommandsManager(this);
  private prefix: string;
  public apiClient: ApiClient;

  public events = new EventEmitter();

  constructor(options: CommandClientOptions) {
    super(options)

    this.prefix = options.prefix;
    this.apiClient = new ApiClient({
      authProvider: options.authProvider!
    });

    this.onMessage((channel: string, user: string, text: string, msg: ChatMessage) => void this.processMessage(channel, user, text, msg));
  }

  async processMessage(channel: string, _user: string, text: string, msg: ChatMessage): Promise<void> {
    if (!text.startsWith(this.prefix)) return;

    const parsed = parseCommand(msg, this.prefix);
    if (parsed === undefined) return;
    const command = this.commands.fetch(parsed);

    if (command === undefined) {
      this.events.emit('commandNotFound', msg, parsed);
      return;
    }

    const ctx: CommandContext = {
      client: this,
      name: parsed.name,
      prefix: this.prefix,
      args: parsed.args,
      argString: parsed.argString,
      message: msg,
      author: msg.userInfo,
      channel: channel,
      command
    }

    if (command.modOnly && !msg.userInfo.isMod) {
      this.events.emit('commandOwnerOnly', ctx);
      return;
    }

    try {
      this.events.emit('commandUsed', 'ctx');
      await command.execute(ctx);
    } catch (e) {
      try {
        await command.onError(ctx, e as Error);
      } catch (e) {
        this.events.emit('commandError', ctx, e as Error);
      }
      this.events.emit('commandError', ctx, e as Error);
    }
  }

  reply(ctx: CommandContext, message: string) {
    this.say(ctx.channel, `@${ctx.author.displayName} ${message}`);
  }
}