// Require .env for tokens
require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Basic modules for file system and file paths
const fs = require('node:fs');
const path = require('node:path');

// Require discord.js classes
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');

// Create a client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a commands collection
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
console.log(`✅ Commands directory path: ${commandsPath}`);
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`✅ Found command files: ${commandFiles}`);
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	console.log(`📂 Loading command from: ${path.basename(filePath)}`);

	try {
		const command = require(filePath);
		// Key as command name, value as exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`✅ Command "${command.data.name}" loaded successfully.`);
		} else {
			console.log(`[WARNING] The command at ${path.basename(filePath)} is missing a required "data" or "execute" property.`);
		}
	} catch (error) {
		console.error(`❌ Error loading command at ${filePath}:`, error);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an errorwhile executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
	console.log(interaction);
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with client's token
client.login(DISCORD_TOKEN);
