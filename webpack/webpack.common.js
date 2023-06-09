const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const path = require('path');

const parseVersion = require('./utils.js').parseVersion;

module.exports = options => {
    const DATAS = {
        VERSION: `'${parseVersion()}'`,
        DEBUG_INFO_ENABLED: options.env === 'dev'
    };
    return {
        entry: {
            polyfills: './src/main/webapp/app/polyfills',
            global: './src/main/webapp/content/scss/global.scss',
            main: './src/main/webapp/app/app.main'
        },
        resolve: { extensions: ['.ts', '.js'], modules: ['node_modules'] },
        module: {
            rules: [{
                    test: /bootstrap\/dist\/js\/umd\//,
                    loader: 'imports-loader?jQuery=jquery'
                },
                {
                    test: /\.ts$/,
                    loaders: ['angular2-template-loader', 'awesome-typescript-loader'],
                    exclude: ['node_modules/generator-jhipster']
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        caseSensitive: true,
                        removeAttributeQuotes: false,
                        minifyJS: false,
                        minifyCSS: false
                    },
                    exclude: ['./src/main/webapp/index.html']
                },
                {
                    test: /\.scss$/,
                    loaders: ['to-string-loader', 'css-loader', 'sass-loader'],
                    exclude: /(vendor\.scss|global\.scss)/
                },
                {
                    test: /(vendor\.scss|global\.scss)/,
                    loaders: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'css-loader'],
                    exclude: /(vendor\.css|global\.css)/
                },
                {
                    test: /(vendor\.css|global\.css)/,
                    loaders: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
                    loaders: [
                        'file-loader?hash=sha512&digest=hex&name=content/[hash].[ext]'
                    ]
                },
                {
                    test: /manifest.webapp$/,
                    loader: 'file-loader?name=manifest.webapp!web-app-manifest-loader'
                },
                {
                    test: /app.constants.ts$/,
                    loader: StringReplacePlugin.replace({
                        replacements: [{
                            pattern: /\/\* @toreplace (\w*?) \*\//gi,
                            replacement: (match, p1, offset, string) =>
                                `_${p1} = ${DATAS[p1]};`
                        }]
                    })
                }
            ]
        },
        plugins: [
            new CommonsChunkPlugin({
                names: ['manifest', 'polyfills'].reverse()
            }),
            new webpack.DllReferencePlugin({
                context: './',
                manifest: require(path.resolve('./target/www/vendor.json'))
            }),
            new CopyWebpackPlugin([{
                    from: './node_modules/core-js/client/shim.min.js',
                    to: 'core-js-shim.min.js'
                },
                { from: './node_modules/swagger-ui/dist', to: 'swagger-ui/dist' },
                { from: './src/main/webapp/swagger-ui/', to: 'swagger-ui' },
                { from: './src/main/webapp/favicon.ico', to: 'favicon.ico' },
                {
                    from: './src/main/webapp/manifest.webapp',
                    to: 'manifest.webapp'
                },
                // { from: './src/main/webapp/sw.js', to: 'sw.js' },
                { from: './src/main/webapp/robots.txt', to: 'robots.txt' },
                {
                    from: './node_modules/jspdf/dist/jspdf.min.js',
                    to: 'jspdf.min.js'
                },
                {
                    from: './node_modules/html2canvas/dist/html2canvas.min.js',
                    to: 'html2canvas.min.js'
                },
                {
                    from: './src/main/webapp/content/pdfmake/build/pdfmake.min.js',
                    to: 'pdfmake.min.js'
                },
                {
                    from: './src/main/webapp/content/pdfmake/build/vfs_fonts.js',
                    to: 'vfs_fonts.js'
                },
                {
                    from: './src/main/webapp/content/jquery',
                    to: 'jquery'
                },
                {
                    from: './src/main/webapp/content/material-icon',
                    to: 'material-icon'
                },
                /* {
                    from: './src/main/webapp/app/shared/state/state.scss',
                    to: 'state.scss'
                }, */
                {
                    from: './src/main/webapp/app/shared/state/state.css',
                    to: 'state.css'
                },
                {
                    from: './src/main/webapp/app/shared/state/landscape.css',
                    to: 'landscape.css'
                },
                {
                    from: './src/main/webapp/content/materialize-css',
                    to: 'materialize-css'
                },
                {
                    from: './src/main/webapp/content/semantic-ui',
                    to: 'semantic-ui'
                },
                {
                    from: './src/main/webapp/content/qrcode',
                    to: 'qrcode'
                },
                {
                    from: './src/main/webapp/content/towords',
                    to: 'towords'
                },
                {
                    from: './src/main/webapp/content/html2pdf.js',
                    to: 'html2pdf.js'
                },
                {
                    from: './src/main/webapp/content/style-material.css',
                    to: 'style-material.css'
                },
                // {
                //     from: './src/main/webapp/content/bootstrap-337-dist',
                //     to: 'bootstrap-337-dist'
                // },
            ]),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new MergeJsonWebpackPlugin({
                output: {
                    groupBy: [{
                            pattern: './src/main/webapp/i18n/fr/*.json',
                            fileName: './target/www/i18n/fr.json'
                        },
                        {
                            pattern: './src/main/webapp/i18n/en/*.json',
                            fileName: './target/www/i18n/en.json'
                        }
                        // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
                    ]
                }
            }),
            new HtmlWebpackPlugin({
                template: './src/main/webapp/index.html',
                chunksSortMode: 'dependency',
                inject: 'body'
            }),
            new AddAssetHtmlPlugin([{
                filepath: path.resolve('./target/www/vendor.dll.js'),
                includeSourcemap: false
            }]),
            new StringReplacePlugin(),
            new WebpackNotifierPlugin({
                title: 'JHipster',
                contentImage: path.join(__dirname, 'logo-jhipster.png')
            })
        ]
    };
};
