const { SlashCommandBuilder } = require('discord.js');
const { fetchWeather, getCoordinatesFromZip } = require('../utils/weather');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snow')
		.setDescription('Checks if it will snow this week')
		.addStringOption(option =>
			option.setName('zip')
				.setDescription('The ZIP/postal code of the location you would like to check')
				.setMinLength(3)
				.setMaxLength(10),
		),
	async execute(interaction) {
		const zipCode = interaction.options.getString('zip')?.trim();

		let location = 'New York, NY';
		await interaction.deferReply();

		try {
			let latitude, longitude;

			// If zip code provided, get coordinates
			if (zipCode) {
				const coords = await getCoordinatesFromZip(zipCode);
				latitude = coords.latitude;
				longitude = coords.longitude;
				location = coords.placeName;
			}

			const weatherData = await fetchWeather(latitude, longitude);
			// format: time: ["2025-02-11", "2025-02-12", ...]
			const days = weatherData.daily.time;
			// format: snowfall_sum: [0, 0, .41, ...]
			const snowfallSums = weatherData.daily.snowfall_sum;

			// Build a reply message with only days that have snowfall
			const lines = [];
			for (let i = 0; i < days.length; i++) {
				if (snowfallSums[i] > 0) {
					const inches = snowfallSums[i] === 1 ? 'inch' : 'inches';
					lines.push(`${days[i].substr(5)}: ${snowfallSums[i]} ${inches}`);
				}
			}

			let replyMessage;

			if (lines.length === 0) {
				replyMessage = `No snowfall forecasted this week for ${location}.`;
			} else {
				replyMessage = `Snow forecast for ${location}:\n` + lines.join('\n');
			}

			// Edit the deferred reply with message
			await interaction.editReply(replyMessage);
		} catch (error) {
			console.error('Error fetching weather data:', error);
			await interaction.editReply('There was an error fetching the snow forecast.');
		}
	},
};