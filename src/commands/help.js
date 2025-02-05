const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides help information for commands'),
	async execute(interaction) {
		await interaction.reply('Here are the available commands...');
	},
};