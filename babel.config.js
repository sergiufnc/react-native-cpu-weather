module.exports = function (api) {
	api.cache(false);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			['module:react-native-dotenv', {
				moduleName: 'react-native-dotenv',
				path: '.env',
				blacklist: null,
				whitelist: null,
				safe: true,
				allowUndefined: true
			}]
		]
	};
};
