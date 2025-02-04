// Require .env for tokens
require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Basic modules for file system and file paths
const fs = require('node:fs');
const path = require('node:path');

// Require discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Create a client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a commands collection
client.commands = new Collection();

client.once(Events.ClientReady, readyClient => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with client's token
client.login(DISCORD_TOKEN);
