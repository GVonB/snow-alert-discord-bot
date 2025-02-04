// Require dotenv for tokens and ids
require('dotenv').config();

// Source the local variables from .env
const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } = process.env;

// Require necessary discord.js features
const { REST, Routes } = require('discord.js');

// Standard node modules
const fs = require('node:fs');
const path = require('node:path');

