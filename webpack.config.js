const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackPwaManifest = require("webpack-pwa-manifest");
// const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
// const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./public/js/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: `${__dirname}/public/js`,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
    new WebpackPwaManifest({
      name: "Budget Tracker",
      short_name: "Budgeter",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      start_url: "/",
      fingerprints: false,
      inject: false,
      icons: [
        {
          src: path.resolve("./public/icons/icon-512x512.png"),
          sizes: [72, 96, 128, 144, 152, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
  mode: "development",
};

module.exports = config;
