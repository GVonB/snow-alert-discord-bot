const axios = require('axios');

// Sample coords of New York City
const DEFAULT_LATITUDE = '40.7128';
const DEFAULT_LONGITUDE = '-74.0060';

async function fetchWeather() {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LATITUDE}&longitude=${DEFAULT_LONGITUDE}&daily=snowfall_sum&timezone=auto`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
}

module.exports = {
	fetchWeather,
};