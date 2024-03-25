const https = require('https')

const cheerio = require('cheerio')

const fs = require('fs')

const path = require('path')

const currentPath = __dirname

const URL = 'https://movie.douban.com/top250'

// 检测文件夹是否存在
const isExistFolder = (inPath)=>{
    const finalPath = path.join(currentPath,inPath)
    return fs.existsSync(finalPath)
}

// 创建新文件夹
const mkNewDir = (folderName)=>{
    fs.mkdir(folderName,(err)=>{
        if(err){
            throw err
        }
    })
}

// 保存爬取到的刷数据
const saveFile = (path,inData)=>{
    fs.writeFile(path,inData,(err,data)=>{
        if(err){
            throw err
        }

    })
}

https.get(URL,(res)=>{
    let html = ''
    res.on('data',(chunk)=>{
        html += chunk
    })
    res.on('end',()=>{
        const $ = cheerio.load(html)
        let files = []
        $('li .item').each(function(){
            const title = $('.title',this).text()
            const star = $('.info .bd .rating_num',this).text()
            const pic = $('.pic img',this).attr('src')
            files.push({
                title,
                star,
                pic,
            })
        })
        const flag = isExistFolder('./files/data.json')
        if(flag){
           saveFile('./files/data.json',JSON.stringify(files))
        }else{
            mkNewDir('files')
            saveFile('./files/data.json',JSON.stringify(files))
        }
    })
})