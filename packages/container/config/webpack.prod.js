const { merge } = require("webpack-merge");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");
const domain = process.env.PRODUCTION_DOMAIN;
const path = require("path");

if (!domain) {
	throw new Error(
		"PRODUCTION_DOMAIN environment variable is required for production builds. " +
			"Please set it in your GitHub Secrets or pass it when building locally."
	);
}

const prodConfig = {
	mode: "production",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "auto",
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "container",
			remotes: {
				marketing: `marketing@${domain}/marketing/remoteEntry.js`,
				auth: `auth@${domain}/auth/remoteEntry.js`,
				dashboard: `dashboard@${domain}/dashboard/remoteEntry.js`,
			},
			shared: { ...packageJson.dependencies },
		}),
	],
};

module.exports = merge(prodConfig, commonConfig);
