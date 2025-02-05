const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snow')
		.setDescription('Checks if it will snow this week'),
	async execute(interaction) {
		await interaction.reply('Checking weather for snow...');
	},
};