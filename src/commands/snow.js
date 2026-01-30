const { SlashCommandBuilder } = require('discord.js');
const { fetchWeather, getCoordinatesFromZip } = require('../utils/weather');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snow')
		.setDescription('Checks if it will snow this week')
		.addIntegerOption(option =>
			option.setName('zip')
				.setDescription('The ZIP Code of the location you would like to check'),
		),
	async execute(interaction) {
		const zipCode = interaction.options.getInteger('zip');

		let location = 'New York, NY';
		await interaction.reply(`Checking weather for snow in ${location}...`);

		try {
			let latitude, longitude;

			// If zip code provided, get coordinates
			if (zipCode) {
				const coords = await getCoordinatesFromZip(zipCode);
				latitude = coords.latitude;
				longitude = coords.longitude;
				location = coords.placeName;
				// Update the message with the actual location
				await interaction.editReply(`Checking weather for snow in ${location}...`);
			}

			const weatherData = await fetchWeather(latitude, longitude);
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