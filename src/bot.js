// Require .env for tokens
require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Require discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

