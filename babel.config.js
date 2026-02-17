module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // IMPORTANT: must be last plugin
    plugins: ["react-native-reanimated/plugin"],
  };
};
