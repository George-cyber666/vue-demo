// pages/activity1/my/mycer.js
const app = getApp()
Page({
  imagePath: '',
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: "我的积分", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      bgColor: 'transparent'
    },
    imgsrc: 'https://small.moreedge.cn/zh_smallxcx/activity1/',
    canvasWidth:'',//海报宽度
    canvasHeight:'', //海报高度
    shareTitle: '',
    shareImg: '',
    isMusic: false,
    dota: {},
    condition: false, //组件显示
    template: {
      "width": "345px",
      "height": "570px",
      "background": "#f8f8f8",
      "views": [{
          "type": "image",
          "url": "https://small.moreedge.cn/zh_smallxcx/activity1/haibao.png",
          "css": {
            "width": "345px",
            "height": "570px",
            "top": "0px",
            "left": "0px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "mode": "scaleToFill"
          }
        },

        {
          "type": "image",
          "url": "",
          "css": {
            "top": "192px",
            "left": "150px",
            "width": "45px",
            "height": "45px",
            "borderRadius":"22.5px"
          }
        },
        {
          "type": "text",
          "text": "",
          "css": {
            "color": "#000000",
            "background": "rgba(0,0,0,0)",
            "width": "200px",
            "height": "21.449999999999996px",
            "top": "250px",
            "left": "172px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "padding": "0px",
            "fontSize": "15px",
            "fontWeight": "bold",
            "maxLines": "2",
            "lineHeight": "21.645000000000003px",
            "textStyle": "fill",
            "textDecoration": "none",
            "fontFamily": "",
            "align": "center"
          }
        }
        // {
        //   "type": "text",
        //   "text": "",
        //   "css": {
        //     "color": "#000000",
        //     "background": "rgba(0,0,0,0)",
        //     "width": "265px",
        //     "height": "52.416000000000004px",
        //     "top": "311px",
        //     "left": "37px",
        //     "rotate": "0",
        //     "borderRadius": "",
        //     "borderWidth": "",
        //     "borderColor": "#000000",
        //     "shadow": "",
        //     "padding": "0px",
        //     "fontSize": "12px",
        //     "fontWeight": "normal",
        //     "maxLines": "3",
        //     "lineHeight": "17.316000000000003px",
        //     "textStyle": "fill",
        //     "textDecoration": "none",
        //     "fontFamily": "",
        //     "align": "left"
        //   }
        // },
        // {
        //   "type": "text",
        //   "text": "",
        //   "css": {
        //     "color": "#000000",
        //     "background": "rgba(0,0,0,0)",
        //     "width": "200px",
        //     "height": "17.16px",
        //     "top": "382px",
        //     "left": "37px",
        //     "rotate": "0",
        //     "borderRadius": "",
        //     "borderWidth": "",
        //     "borderColor": "#000000",
        //     "shadow": "",
        //     "padding": "0px",
        //     "fontSize": "12px",
        //     "fontWeight": "normal",
        //     "maxLines": "2",
        //     "lineHeight": "17.316000000000003px",
        //     "textStyle": "fill",
        //     "textDecoration": "none",
        //     "fontFamily": "",
        //     "align": "left"
        //   }
        // }
      ]
    },
    dota: {}
  },
  onLoad() {
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
    this.getZsPageInfo()
    if (app.globalData.isMusic) {
      app.globalData.innerAudioContext.play();
    } else {
      app.globalData.innerAudioContext.pause();
    }
    this.setData({
      isMusic: app.globalData.isMusic
    })
  },
  onImgOK(e) {
    this.imagePath = e.detail.path
  },
  // 播放音乐
  music() {
    if (this.data.isMusic) {
      this.setData({
        isMusic: false
      })
      app.globalData.isMusic = false;
      app.globalData.innerAudioContext.pause();
    } else {
      this.setData({
        isMusic: true
      })
      app.globalData.isMusic = true;
      app.globalData.innerAudioContext.play();
    }
  },
  // 跳转首页
  clicktoindex() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index'
    });
  },
  // 跳转活动
  clicktoac() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/activity/activity'
    });
  },
  // 绘制海报
  drawImage() {
    wx.showLoading({
      title: '海报生成中...'
    })
    this.setData({
      condition: true
    })
    wx.hideLoading()
  },
  close(){
    this.setData({
      condition: false
    })
  },
  // 跳转我的
  clicktomy() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/my/my'
    });
  },
  // 获取页面数据
  getZsPageInfo() {
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getZsPageInfo.php',
      method: 'POST',
      data: {
        'openid': wx.getStorageSync('visitor_base_info').openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            dota: res.data.data,
            // ['template.views[1].text']: res.data.data.zsContent[0],
            // ['template.views[2].text']: res.data.data.zsContent[1],
            ['template.views[1].url']: res.data.data.head,
            ['template.views[2].text']: res.data.data.nickname,
            // ['template.views[5].text']: res.data.data.zsContent[2],
            // ['template.views[6].text']: res.data.data.zsContent[3],
            dota: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/thirdPartyActivity/activity1/index/index'
            });
          }, 2000)
        }
      }
    })
  },
  // 保存图片
  saveImage1(){
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success(res) {
        wx.showToast({
          title: '图片保存成功',
          icon: 'success',
          duration: 2000
        })
      },
    });
  },
  // 获取分享数据
  getShareInfo() {
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getShareInfo.php',
      method: 'POST',
      data: {
        'openid': wx.getStorageSync('visitor_base_info').openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          shareTitle: res.data.shareTitle,
          shareImg: res.data.shareImg
        })
      }
    })
  },
  // 收集分享数据
  addShareNum() {
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/addShareNum.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    this.addShareNum()
    return {
      title: this.data.shareTitle,
      path: '/pages/thirdPartyActivity/activity1/index/index',
      imageUrl: this.data.shareImg
    }
  }
})