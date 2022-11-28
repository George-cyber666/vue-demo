// pages/activity1/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: "我的", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      showTitle: true,
      bgColor: 'transparent'
    },
    imgsrc: 'https://small.moreedge.cn/zh_smallxcx/activity1/',
    shareTitle: '',
    shareImg: '',
    isMusic: false,
    dota: {}
  },
  onLoad() {
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
    this.getMinePageInfo()
    if (app.globalData.isMusic) {
      app.globalData.innerAudioContext.play();
    } else {
      app.globalData.innerAudioContext.pause();
    }
    this.setData({
      isMusic: app.globalData.isMusic
    })
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
  // 跳转我的积分
  clicktomyintegral() {
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity1/my/myintegral'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/activity1/my/myintegral'
      })
    }

  },
  // 跳转我的奖品
  clicktomyprize() {


    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity1/my/myprize'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/activity1/my/myprize'
      })
    }
  },
  // 跳转我的证书
  clicktomycer() {
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity1/my/mycer'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/activity1/my/mycer'
      })
    }
  },
  // 获取页面数据
  getMinePageInfo() {
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getMinePageInfo.php',
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