const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');
const { writeFileSync } = require('fs');

module.exports = function(name, meta, output) {
  const root = path.resolve(__dirname, '../..', name);
  return {
    entry: {
      [name + '.user']: path.resolve(root, 'src/index')
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.resolve(root, 'src'),
          use: [
            {
              loader: 'ts-loader',
              options: {
                onlyCompileBundledFiles: true,
                experimentalFileCaching: true
              }
            }
          ]
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: '[name].js',
      path: output,
    },
    plugins: [
      new ProgressBarPlugin(),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('Generate meta.js', () => {
            writeFileSync(path.resolve(output, name + '.meta.js'), meta.trim(), {
              encoding: 'UTF-8'
            });
          });
        }
      }
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new webpack.BannerPlugin({
          banner: meta,
          raw: true
        }),
      ]
    },
  };
}