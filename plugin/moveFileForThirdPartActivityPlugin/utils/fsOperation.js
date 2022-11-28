const fs = require('fs')
const path = require('path')

function createFolders (folders, basePath = '') {
  let curFolderPath
  folders.forEach(folder => {
    curFolderPath = path.join(basePath, folder)
    if (!fs.existsSync(curFolderPath)) {
      fs.mkdirSync(curFolderPath)
    }
  })
}

function removeFolder (folderPath) {
  let files = []
  if (fs.existsSync(folderPath)) {
    files = fs.readdirSync(folderPath)
    files.forEach(file => {
      let curPath = path.join(folderPath, file)
      if (fs.statSync(curPath).isDirectory()) { // recurse
        this.removeFolder(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
  }
}

/**
 * 遍历目录
 * @param {String}} dir 目录
 * @param {Object} { readFile, finish } 读取文件回调，结束回调
 */

function mapDir (dir, { readFile = () => {}, finish = () => {} }) {
  const inlcude = [ '.json' ]
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((filename, index) => {
      let filePath = path.join(dir, filename)
      fs.stat(filePath, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        if (stats.isDirectory()) {
          mapDir(filePath, { readFile, finish })
        } else if (stats.isFile()) {
          if (!inlcude.includes(path.extname(filePath))) return
          // fs.readFile(filePath, (err, data) => {
          //   if (err) {
          //     console.error(err)
          //     return
          //   }
          //   readFile && readFile(data)
          // })
          // let data = fs.readFileSync(filePath, 'utf-8')
          readFile && readFile(filePath)
        }
      })
      if (index === files.length - 1) {
        finish && finish()
      }
    })
  })
}

module.exports = {
  createFolders,
  removeFolder,
  mapDir
}
