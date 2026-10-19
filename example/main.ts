import { StaticAuthProvider } from '@twurple/auth';
import { CommandClient } from '../src/main.ts';
import { config } from 'dotenv';

config();

const authProvider = new StaticAuthProvider(Deno.env.get('CLIENT_ID')!, Deno.env.get('ACCESS_TOKEN')!);

const client = new CommandClient({
  authProvider: authProvider,
  prefix: '!',
  channels: ['r0dn3ys']
});

client.commands.loader.loadDirectory('./example/commands', {
  maxDepth: 1,
});

client.connect();