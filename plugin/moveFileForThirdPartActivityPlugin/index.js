// 文件监听：https://www.jianshu.com/p/e7b530579ab3
// const chokidar = require('chokidar')
// 处理文件和目录的路径：https://www.nodeapp.cn/path.html
const path = require('path')
const fs = require('fs')

function requireNoCache(path) {
  try {
    delete require.cache[require.resolve(path)] // 删除require缓存
    const content = require(path)
    return content
  } catch (err) {
    console.log(err)
  }
}

class moveFileForThirdPartActivityPlugin {
  constructor() {
    let env = process.env.NODE_ENV
    this.env = env
    this.thirdPartyActivityPath = path.resolve('./src/zhonghai/pages/thirdPartyActivity')
    this.thirdPartyJsonPath = path.resolve('./src/zhonghai/app.json')
    this.distJsonPath = path.resolve('./dist/app.json')
    // this.buildDistJsonPath = path.resolve('./dist/app.json')
    this.devThirdPartyActivityPath = path.resolve('./dist/thirdPartyActivity')
    // this.buildThirdPartyActivityPath = path.resolve('./dist/build/mp-weixin/pages/thirdPartyActivity')
  }
  // 递归创建文件目录并且复制文件
  copyFile(src, target) {
    if (fs.existsSync(target)) return
    fs.mkdirSync(target)
    let that = this
    getDicInfo(src, target)
    function getDicInfo(src, target) {
      if (fs.existsSync(src)) {
        let files = fs.readdirSync(src)
        files.forEach(file => {
          let curPath = path.join(src, file)
          let distCurPath = path.join(target, file)

          const curPathIsDir = fs.statSync(curPath).isDirectory()

          if (!fs.existsSync(distCurPath) && curPathIsDir) {
            fs.mkdirSync(distCurPath)
          }
          if (curPathIsDir) {
            getDicInfo.call(this, curPath, distCurPath)
          } else {
            that.copyFileHandler(curPath, distCurPath)
          }
        })
      }
    }
  }
  // 将第三方的文件按照路径复制到打包后项目文件中
  copyFileHandler(src, target) {
    let extname = path.extname(src)
    switch (extname) {
      // json文件用require读取处理
      case '.json':
        try {
          let cutJson = requireNoCache(src)
          let targetJson = Object.assign({}, cutJson)
          targetJson = JSON.stringify(targetJson, null, '\t')
          fs.writeFileSync(target, targetJson, 'utf-8')
        } catch (e) {
          console.log('json格式错误')
          console.log(e)
        }
        break
      // js 文件用fs.readFileSync读取处理
      case '.js':
        try {
          let srcJs = fs.readFileSync(src, 'utf-8')
          fs.writeFileSync(target, srcJs.toString(), 'utf-8')
        } catch (e) {
          console.log('js格式错误')
          console.log(e)
        }
        break
      default:
        fs.writeFileSync(target, fs.readFileSync(src), 'utf-8')
    }
  }
  // 处理第三方代码中的app.json，将其中的路径配置整合到项目的app.json中去
  handleAppJson(targetPath) {
    let json = requireNoCache(this.thirdPartyJsonPath)
    let distJson = requireNoCache(targetPath)
    let appJson = Object.assign({}, json)
    let pages = appJson.pages
    if (pages && pages.length) {
      const page = pages[0]
      const arr = page.split('/')
      let rootPath = `${arr[0]}/${arr[1]}`
      let pagesStr = JSON.stringify(pages)
      pagesStr = pagesStr.replace(new RegExp(`${rootPath}/`, 'g'), '')
      let obj = {
        root: rootPath,
        pages: JSON.parse(pagesStr)
      }
      distJson.subPackages.push(obj)
      let targetJson = Object.assign({}, distJson)
      targetJson = JSON.stringify(targetJson, null, '\t')
      fs.writeFileSync(this.distJsonPath, targetJson, 'utf-8')
    }
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('moveFileForThirdPartActivityPlugin', (complication, callback) => {
      this.copyFile(this.thirdPartyActivityPath, this.devThirdPartyActivityPath)
      this.handleAppJson(this.distJsonPath)
      callback()
    })
  }
}
module.exports = moveFileForThirdPartActivityPlugin
