const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/server')
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true
    }),
    new CopyPlugin({
      patterns: [{ from: './views/index.html.ejs', to: join(__dirname, 'views') }]
    })
  ]
}
