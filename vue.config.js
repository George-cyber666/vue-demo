const MoveFileForThirdPartActivityPlugin = require('./plugin/moveFileForThirdPartActivityPlugin/index')
const path = require('path')


const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) console.log('⚠️ 注意⚠️  请不要用非production环境打包给项目用')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    context: path.join(__dirname),
    plugins: [
      new MoveFileForThirdPartActivityPlugin(),
    ]
  },
}
