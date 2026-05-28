const { merge } = require("webpack-merge");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");
const webpack = require("webpack");
const domain = process.env.PRODUCTION_DOMAIN_AUTH;
const path = require("path");

const prodConfig = {
	mode: "production",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "auto",
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": JSON.stringify(true),
		}),
		new ModuleFederationPlugin({
			name: "auth",
			filename: "remoteEntry.js",
			exposes: {
				"./AuthApp": "./src/bootstrap",
			},
			shared: { ...packageJson.dependencies },
		}),
	],
};

module.exports = merge(prodConfig, commonConfig);
