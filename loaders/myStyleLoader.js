// 作用：将css内容，通过style标签插入到页面中
// source为要处理的css源文件

module.exports = function (source) {
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${source};
    document.head.appendChild(style);
  `
  // if (this.query.name === 'test') {
  // this.callback(null, style)
  // }
  // console.log('%c 🥤 style: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', this)
  return style
}
