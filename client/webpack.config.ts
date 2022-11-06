import * as webpack from 'webpack';
const { argv } = require('yargs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
import {Config, configs} from "./config";

const production = (argv.env && argv.env.production);

function generateConfig(config: Config) {
    // These are templated literally into the code
    const globalConsts = {
        CHART_COLOUR: JSON.stringify(config.chartColour),
        PLACEHOLDER_COURSE_CODE: JSON.stringify(config.placeholderCourseCode),
        SEMESTERS: JSON.stringify(config.semesters),
        DEFAULT_CUTOFFS: JSON.stringify(config.defaultCutoffs),
    };

    return {
        mode: production ? "production" : "development",
        devtool: production ? "none" : "source-map",

        entry: `./src/index.tsx`,
        output: {
            path: path.resolve(__dirname, 'dist', config.name),
            filename: 'app.js'
        },

        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test:  /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                prependData: `$bgColour: ${config.bgColour};`,
                            }
                        }
                    ]
                },
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                templateParameters: {
                    ...config,
                    cachebust: Date.now(),
                },
            }),
            new webpack.DefinePlugin(globalConsts),
            new MiniCssExtractPlugin({
                filename: 'app.css',
            }),
            new CopyPlugin([
                {
                    from: `img/*`,
                },
                {
                    from: 'src/ads.txt',
                },
                {
                    from: 'src/404.html',
                },
                {
                    from: `site-specific/${config.name}`,
                }
            ]),
        ]
    }
}

module.exports = configs.map(generateConfig);
