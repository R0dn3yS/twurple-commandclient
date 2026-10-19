import type { ChatMessage, ChatUser } from '@twurple/chat';
import type { CommandClient } from './CommandClient.ts';
import type { Command } from './Command.ts';

export interface CommandContext {
  client: CommandClient;
  message: ChatMessage;
  author: ChatUser;
  channel: string;
  prefix: string;
  command: Command;
  name: string;
  args: string[];
  argString: string;
}