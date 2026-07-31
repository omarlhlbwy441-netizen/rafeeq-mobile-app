const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for SVG and other assets
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Remove svg from assetExts if using react-native-svg-transformer
// config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
// config.resolver.sourceExts.push('svg');

module.exports = config;
