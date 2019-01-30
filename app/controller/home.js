'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'kkk';
  }

  async reduce() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const type = file.mime.split('/')[1];
    let result;
    debugger;
    switch (type) {
      case 'gif':
        result = await ctx.service.handleGif.receiveStream();
        break;
      case 'jpeg':
        // ...handle jpg
        break;
      case 'png':
        result = await ctx.service.handlePng.reduceUpload();
        break;
      default:
        ctx.logger.error(new Error('无效参数，上传文件类型暂只有gif，jpg，png'));
        break;
    }
    ctx.body = {
      success: true,
      data: result,
      des: ''
    }
  }
}

module.exports = HomeController;
