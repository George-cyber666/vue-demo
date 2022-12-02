// 作用：将css内容，通过style标签插入到页面中
// source为要处理的css源文件
function loader(source) {
  let style = `
    let style = document.createElement('style');
    style.setAttribute("type", "text/css");
    style.innerHTML = ${source};
    document.head.appendChild(style);
  `
  console.log('%c 🍯 style: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', style)
  return style
}
module.exports = loader
