const axios = require('axios');

// Sample coords of New York City
const DEFAULT_LATITUDE = '40.7128';
const DEFAULT_LONGITUDE = '-74.0060';

/**
 * Convert a US ZIP code to latitude and longitude coordinates
 * Uses the free zippopotam.us API
 */
async function getCoordinatesFromZip(zipCode) {
	try {
		const response = await axios.get(`https://api.zippopotam.us/us/${encodeURIComponent(zipCode)}`);
		const place = response.data.places[0];
		return {
			latitude: place.latitude,
			longitude: place.longitude,
			placeName: `${place['place name']}, ${place['state abbreviation']}`,
		};
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error('Invalid ZIP code. Please check and try again.');
		}
		console.error('Error fetching coordinates:', error);
		throw new Error('Unable to fetch location data.');
	}
}

/**
 * Fetch weather data from Open-Meteo API
 * @param {string} latitude - Optional latitude (defaults to NYC)
 * @param {string} longitude - Optional longitude (defaults to NYC)
 */
async function fetchWeather(latitude = DEFAULT_LATITUDE, longitude = DEFAULT_LONGITUDE) {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&precipitation_unit=inch&daily=snowfall_sum&timezone=auto`;
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
}

module.exports = {
	fetchWeather,
	getCoordinatesFromZip,
};