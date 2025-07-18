const { SlashCommandBuilder } = require('discord.js');
const { fetchWeather } = require('../utils/weather');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snow')
		.setDescription('Checks if it will snow this week')
		.addIntegerOption(option =>
			option.setName('zip')
				.setDescription('The ZIP Code of the location you would like to check'),
		).addStringOption(option =>
			option.setName('city')
				.setDescription('The city to check forecast for'))
		.addStringOption(option =>
			option.setName('state')
				.setDescription('The state to check forecast for'),
		),
	async execute(interaction) {
		await interaction.reply('Checking weather for snow...');

		try {
			const weatherData = await fetchWeather();
			// format: time: ["2025-02-11", "2025-02-12", ...]
			const days = weatherData.daily.time;
			// format: snowfall_sum: [0, 0, .41, ...]
			const snowfallSums = weatherData.daily.snowfall_sum;

			// Build a reply message with only days that have snowfall
			let replyMessage = '';
			for (let i = 0; i < days.length; i++) {
				if (snowfallSums[i] > 0) {
					if (snowfallSums[i] === 1.0) {
						replyMessage += `${days[i].substr(5)}: ${snowfallSums[i]} inch\n`;
					} else {
					    replyMessage += `${days[i].substr(5)}: ${snowfallSums[i]} inches\n`;
					}
				}
			}

			if (!replyMessage) {
				replyMessage = 'No snowfall forecast this week.';
			}

			// Edit the deferred reply with message
			await interaction.editReply(replyMessage);
		} catch (error) {
			console.error('Error fetching weather data:', error);
			await interaction.editReply('There was an error fetching the snow forecast.');
		}
	},
};