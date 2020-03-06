var path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// firstly build (isProduction=false) (it would clear all dist), then build (isProduction=true) and publish.
const isProduction = true;

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        primevue: './src/main.js'
    },
    output: {
        filename: isProduction ? 'primevuelibrary.min.js' : 'primevuelibrary.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'PrimeVueLibrary'
    },
    externals: {
        vue: 'Vue',
        quill: 'Quill'
    },
    optimization: {
        minimize: isProduction,
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            cacheGroups: {
                extractedCSS: {
                    test: (module, chunks) => module.constructor.name === 'CssModule',
                    name: "primevue",
                    chunks: "all",
                    enforce: true
                }
            }
        }
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    //'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=fonts'
            },
            {
                test: /\.(jpg|png|gif)$/i,
                loader: 'file-loader?name=[name].[ext]&outputPath=images/'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin([
            { from: 'node_modules/primevue/resources/themes/', to: 'themes/' },
            'node_modules/quill/dist/quill.min.js'
        ]),
        new MiniCssExtractPlugin({
            filename: isProduction ? 'primevuelibrary.min.css' : 'primevuelibrary.css'
        })
    ]
};

if (!isProduction) {
    module.exports.plugins[module.exports.plugins.length] = new CleanWebpackPlugin();
}