import { Client, CommandInteraction, Message, ApplicationCommandOptionData } from 'discord.js';
import './Client';

export interface Command {
  name: string,
  description: string,
  options: ApplicationCommandOptionData[]
  handleMessage: (client: Client, message: Message, args: string[]) => Promise<void>
  handleInteraction: (client: Client, message: CommandInteraction) => Promise<void>
}
