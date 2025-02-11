const { SlashCommandBuilder } = require('discord.js');
const { fetchWeather } = require('../utils/weather');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snow')
		.setDescription('Checks if it will snow this week'),
	async execute(interaction) {
		const forecast = await fetchWeather();

		await interaction.reply(`Forecast: ${forecast}`);
	},
};