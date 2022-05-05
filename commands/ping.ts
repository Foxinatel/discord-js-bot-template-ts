import * as Discord from 'discord.js';
import { Command } from 'types/Command';
import { parse as parsePath } from 'path';
import { ApplicationCommandOptionData } from 'discord.js';

// Due to how dynamic importing works in TypeScript
// All classes will have to be named "Instance"

export class Instance implements Command {
  // Get the name of the command from the filename
  name = parsePath(__filename).name;

  // self-explanatory
  description = 'Get the ping of the bot';

  // An array of ApplicationCommand objects. Check this link for more information:
  // https://discord.js.org/#/docs/discord.js/stable/typedef/ApplicationCommandOptionData
  options: ApplicationCommandOptionData[] = [];

  // Handler for raw messages
  async handleMessage (client: Discord.Client, message: Discord.Message) {
    await message.channel.send(this.handle(client));
  }

  // Handler for slash commands
  async handleInteraction (client: Discord.Client, interaction: Discord.CommandInteraction) {
    await interaction.reply(this.handle(client));
  }

  // You can add as many extra functions as you'd like to this class
  // I recommend trying to make both of the handlers use the same command
  handle (client: Discord.Client): Discord.MessageOptions {
    return {
      embeds: [{
        title: ':ping_pong: Ping!',
        description: `**Pong!** Got a response from Discord in ${client.ws.ping} ms!`,
        color: 9442302
      }]
    };
  }
}
