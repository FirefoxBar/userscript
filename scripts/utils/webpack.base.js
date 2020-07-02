const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');
const { writeFileSync } = require('fs');

module.exports = function(options) {
  const { isDev, name, meta, output } = options;
  const root = path.resolve(__dirname, '../..', name);
  const minimizer = [
    new webpack.BannerPlugin({
      banner: meta,
      raw: true
    })
  ]
  if (!isDev) {
    minimizer.unshift(new TerserPlugin());
  }
  const cssLoader = [
    'gm-style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }
  ];
  if (!isDev) {
    cssLoader.push({
      loader: 'postcss-loader',
      options: {
        plugins: [
          require('cssnano')
        ]
      }
    });
  }
  return {
    context: root,
    entry: {
      [name + '.user']: path.resolve(root, 'src/index')
    },
    mode: 'production',
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
        {
          test: /\.css$/,
          use: cssLoader
        }
      ],
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ],
    },
    output: {
      filename: '[name].js',
      path: output,
    },
    plugins: [
      new ProgressBarPlugin(),
      {
        apply: compiler => {
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
      minimizer: minimizer
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'loader')
      ]
    },
    stats: "verbose"
  };
}