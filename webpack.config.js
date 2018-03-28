const webpack = require('webpack');
const path = require('path');
const poststylus = require('poststylus');
const ExtractTestPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const config = {
    entry: {
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-router-dom',
            'jquery', 'redux', 'react-redux', 'recompose', 'moment', 'bootstrap',
            'lodash-es', 'tslib', 'highcharts/highstock'],
        app: ['./src/views/index.tsx']
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'assets')
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useBabel: true,
                        'babelOptions': {
                            'babelrc': false,
                            'presets': [
                                ['env', {
                                    targets: {
                                        browsers: ['last 2 versions', 'ie >= 10']
                                    }
                                }]
                            ]
                        }
                    }
                }]
            },
            {
                test: /\.styl$/,
                use: ExtractTestPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTestPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
            },
            {
                test: /\.(ttf|otf|woff2?|eot|svg)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['assets/*.css', 'assets/*.js', 'assets/*.map']),
        new webpack.LoaderOptionsPlugin({
            stylus: {
                use: poststylus(['autoprefixer'])
            }
        }),
        new ExtractTestPlugin('app.[chunkhash].css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new UglifyJSPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ManifestPlugin({ fileName: 'webpack-manifest.json' })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: { 'lodash': 'lodash-es' }
    }
};

if (!isProduction) {
    config.plugins = [
        new CleanWebpackPlugin(['assets/*.css', 'assets/*.js', 'assets/*.map']),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            stylus: {
                use: poststylus(['autoprefixer'])
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTestPlugin('app.[chunkhash].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new ManifestPlugin({ fileName: 'webpack-manifest.json' })
    ];
    config.devtool = 'source-map';
}
module.exports = config;