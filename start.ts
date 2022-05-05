import * as Discord from 'discord.js';
import { Command } from './types/Command';
import fs from 'fs';
import config from './config.json';

console.log('Starting!');

// Instantiate a new client using the intents defined in config.json
const client = new Discord.Client({ intents: config.intents.map((intent: string) => eval(`Discord.Intents.FLAGS.${intent}`)) });

client.commands = new Discord.Collection();

fs.readdirSync('./commands')
  .filter(file => file.endsWith('.ts'))
  .forEach(file => {
    import(`./commands/${file}`).then(Command => {
      const command: Command = new Command.Instance();
      client.commands.set(command.name, command);
    });
  });

const errorMessage = (error: Error): Discord.MessageOptions => ({
  embeds: [{
    title: '**Something went wrong!**',
    description: error.stack,
    color: 13632027
  }]
});

client.on('error', e => console.log(`[ERROR] ${e}`));
client.on('warn', e => console.log(`[WARN] ${e}`));

client.once('ready', async () => {
  const globalCommands = client.application?.commands;
  const existingGlobal = await globalCommands?.fetch();

  client.commands.forEach(async (command: Command) => {
    if (!existingGlobal?.map(x => x.name).includes(command.name)) {
      await globalCommands?.create(command);
    }
  });

  console.log('Bot online!');
});

// Begin Command Handler
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/\s+/);
  const command = args.shift()?.toLowerCase() ?? '';

  if (!client.commands.has(command)) return;

  try {
    await client.commands.get(command)?.handleMessage(client, message, args);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      await message.channel.send(errorMessage(error));
    } else {
      console.error("Caught a value that isn't an instance of an error:\n" + error);
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isApplicationCommand()) {
      await client.commands.get(interaction.commandName)?.handleInteraction(client, interaction as Discord.CommandInteraction);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      await interaction.channel?.send(errorMessage(error));
    } else {
      console.error("Caught a value that isn't an instance of an error:\n" + error);
    }
  }
});

client.login(config.token);
