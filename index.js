// import axios from 'axios'
// import qs from 'qs'
const axios = require('axios')
const qs = require('qs')
const fs = require('fs')
const xlsx = require('node-xlsx')

async function getData(params){
    const res = await axios.post('http://xentry.3110110.com/login?action=search',qs.stringify(params))
    const txt = res.data.toString()
    let reg = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g
    const data = txt.match(reg).map(item => {
        return [item.toString().split('"')[1]]
    })
    var buffer = xlsx.build([{name: 'mySheetName', data}]);
    fs.writeFile(`./src/file/${params.cffnum}.xlsx`, buffer, err => {
        if (err) {
          console.error(err)
          return
        }
      })
}

function getFileData(filePath){
    const workSheetsFromFile = xlsx.parse(filePath);
    const arr = workSheetsFromFile[0]['data'].map(item => {
        return item[0]
    })
    return arr
}

let arr = []


Array(20).fill('1').forEach((item,index)=>{
    const cffnum = (index+1).toString().padStart(4,'0')
    arr = [...arr,...getFileData(`./src/file/${cffnum}.xlsx`)]
})


const data = [...new Set(arr)].map(item=>[item])


var buffer = xlsx.build([{name: 'mySheetName', data}]);
    fs.writeFile(`./src/file/all.xlsx`, buffer, err => {
        if (err) {
          console.error(err)
          return
        }
      })



// getData({cffnum})

