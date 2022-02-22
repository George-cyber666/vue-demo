module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint', // 一个对Babel解析器的包装，babel本身也是js解析器的一种，如果代码需要babel转化，则使用这个解析器。解析器必须是本地安装的一个模块，所以必须在本地node_modules中
    sourceType: 'module', // 指定JS代码来源的类型，script(script标签引入？) | module（es6的module模块），此处采用module
    ecmaVersion: 'es6'
  },
  extends: [
    'eslint:recommended',
    /**
     * vue 的额外添加的规则是 v-if, v-else 等指令检测
     * 额外添加的规则可查看 https://vuejs.github.io/eslint-plugin-vue/rules/
     */
    "plugin:vue/essential"
  ],
  rules: {
    'semi': ['error', 'never'],  // 强制禁用分号
  }
}
