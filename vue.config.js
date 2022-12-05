const MoveFileForThirdPartActivityPlugin = require('./plugin/moveFileForThirdPartActivityPlugin/index')
const path = require('path')
const MyStyleLoader = require('./loader/myStyleLoader')


const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) console.log('⚠️ 注意⚠️  请不要用非production环境打包给项目用')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    context: path.join(__dirname),
    plugins: [
      new MoveFileForThirdPartActivityPlugin(),
    ],
    module: {
      rules: [
        {
          test: /main.css/,
          // 相同优先级的loader链，执行顺序为：从右到左，从下到上
          // 如use: ['loader1', 'loader2', 'loader3']，执行顺序为 loader3 → loader2 → loader1
          // loader: MyStyleLoader,
        }
      ]
    }
  },
}
