/**
 * 批量修改文件内容
 * node modify-file-content.js '工程1|工程2'
 *
 * 0.需要安装node环境
 * 1.多个工程用 | 分割
 * 2.工程下检查目录 -> subFolder
 * 3.检查文件类型正则 -> fileReg
 * 4.检查内容正则 -> strReg
 */
const util = require('util')
const fs = require('fs')
const path = require('path')

const projects = (process.argv[2] || '').split('|')
const subFolder = ['app', 'api'] // 工程下检查的目录名
const fileReg = /\.(js|php|vue|html)$/ //检查的文件类型
const strReg = /400-005-9151|4000059151|400-0059151|400 005 9151/g // 检查匹配正则
const target = '95730' // 匹配成功后替换的字符传

for (let project of projects) {
  for (let folder of subFolder) {
    main(path.join(__dirname, project, folder))
  }
}

async function main (filePath = '') {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(filePath + ' is not exist')
      return false
    }

    const stat = fs.statSync(filePath)
    if (stat.isFile() && fileReg.test(filePath)) {
      modify(filePath)
    } else if (stat.isDirectory()) {
      const dir = await promisify(fs.readdir)(filePath)
      for (let name of dir) {
        main(path.join(filePath, name))
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function modify (path) {
  fs.readFile(path, 'utf8', (err, files) => {
    if (strReg.test(files)) {
      console.log(path + '  has been modified')
      let result = files.replace(strReg, target)
      fs.writeFile(path, result, 'utf8', (err) => (err && console.log(err)))
    }
  })
}

function promisify (fn) {
  return util.promisify(fn)
}
