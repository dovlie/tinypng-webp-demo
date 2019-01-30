'use strict';
const Controller = require('egg').Controller;
const { createReadStream } = require('fs'); //读取文件流
const { request } = require('https');  //请求接口数据

const option = {
  hostname: 'tinypng.com',
  port: 443,
  path: '/web/shrink',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  }
}

class uploadController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('upload', {
      title: 'upload',
      result: ''
    })
  }

  async reduceUpload() {
    const { ctx } = this;
    const file = ctx.request.files[0];

    let result;

    try {
      result = {
        success: true,
        data: await uploadHandle(file.filepath)
      }
    } catch (error) {
      result = {
        success: false,
        data: error
      }
    }
    console.log(result, 11)
    await ctx.render('upload', { //上传图片后重新进行渲染
      title: 'upload',
      result: result.data
    })
  }
}

const uploadHandle = (filepath) => {
  return new Promise((resolve, reject) => {
    createReadStream(filepath).pipe(request(option, function(resp) {
      resp.on('data', function(resInfo) {
        resInfo = resInfo.toString()
        try {
          resInfo = JSON.parse(resInfo)
          resolve(resInfo)
        } catch(err) {
          reject(err)
        }
      })
    }))
  })
}

module.exports = uploadController;
