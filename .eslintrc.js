module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    sourceType: 'module', // 指定JS代码来源的类型，script(script标签引入？) | module（es6的module模块），此处采用module
    parser: 'babel-eslint',
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
