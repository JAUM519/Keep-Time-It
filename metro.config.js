const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Some Firebase + Hermes setups require .cjs to resolve correctly.
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

module.exports = config;
