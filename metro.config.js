const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

const { resolver } = config;
const { assetExts, sourceExts } = resolver;

config.resolver = {
  ...resolver,
  assetExts: [...assetExts, "wasm"],
  sourceExts: sourceExts.filter((ext) => ext !== "wasm"),
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return middleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: './app/global.css' })