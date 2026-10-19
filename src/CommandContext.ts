import type { ChatMessage, ChatUser } from '@twurple/chat';
import type { CommandClient } from './CommandClient.ts';
import type { Command } from './Command.ts';

export interface CommandContext {
  client: CommandClient;
  message: ChatMessage;
  author: ChatUser;
  channel: Channel;
  prefix: string;
  command: Command;
  name: string;
  args: string[];
  argString: string;
  reply(message: string): Promise<void>;
}

export class Channel {
  public client: CommandClient;
  public id: string;

  constructor(client: CommandClient, id: string) {
    this.client = client;
    this.id = id;
  }

  say(message: string) {
    this.client.say(this.id, message);
  }
}