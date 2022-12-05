// pages/activity1/activity/activity.js
const app = getApp()
Page({
  data: {
    defaultData: {
      title: "活动", // 导航栏标题
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
    openId: '',
    isMusic: false,
    sessionCode: '',
    lx_qd_num:0,
    qdList:[],

  },
  onLoad() {
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({
        url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index')
      })
    }
    this.getShareInfo()
    this.getSessionCode()
    this.getActivityPageInfo()
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
  // 签到
  signin(e) {
    let that = this
    let git = wx.getStorageSync('visitor_base_info')
    if (e.currentTarget.dataset.id == 0) {
      return
    } else {
      // 签到
      wx.request({
        url: 'https://small.moreedge.cn/zh_smallxcx/api/addQdInfo.php',
        method: 'POST',
        data: {
          'openid': git.openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 2000,
            })
            that.setData({
              lx_qd_num: res.data.data.lx_qd_num,
              qdList: res.data.data.qdList,
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 2000,
            })
          }

        },
      })
    }

  },
  getActivityPageInfo(){
    let that = this;
    let git = wx.getStorageSync('visitor_base_info');
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getActivityPageInfo.php',
      method: 'POST',
      data: {
        'openid': git.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if(res.data.status==1){
          that.setData({
            lx_qd_num:res.data.data.lx_qd_num,
            qdList:res.data.data.qdList
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail(){
        wx.showToast({
          title: '当前上传人数过多,请稍候重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  // 上传步数
  uploadrun() {
    let that = this;
    let git = wx.getStorageSync('visitor_base_info');
    wx.showLoading({
      title: '步数上传中'
    })
    wx.getWeRunData({
      success(res) {
        wx.request({
          url: 'https://small.moreedge.cn/zh_smallxcx/api/uploadSteps.php',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            openid: git.openId,
            encryptedData: res.encryptedData,
            iv: res.iv,
            sessionKeyCode: that.data.sessionCode,
          },
          success(res) {
            that.getSessionCode();
            if (res.data.status == 1) {
              that.setData({
                ['dota.userInfo.score']: res.data.data.score,
                ['dota.cityPm']: res.data.data.cityPm,
                ['dota.countyPm']: res.data.data.countyPm,
                ['dota.cityPrevThreeList']: res.data.data.cityPrevThreeList,
                ['dota.cityOtherList']: res.data.data.cityOtherList,
                ['dota.countyPrevThree']: res.data.data.countyPrevThree,
                ['dota.countyOtherThree']: res.data.data.countyOtherThree,
              })
              wx.hideLoading()
              wx.showToast({
                title: '恭喜你今日上传' + res.data.data.todaySteps + '步数,成功获得' + res.data.data.todayScore + '积分',
                icon: 'none',
                duration: 2000,
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }

          },
          fail: function (res) {
            that.getSessionCode()
            wx.hideLoading()
            wx.showToast({
              title: '当前上传人数过多,请稍候重试',
              icon: 'none',
              duration: 2000,
            })
          },
        })
      },
    })
  },
  //获取sessionCode
  getSessionCode() {
    let that = this
    wx.login({
      success: function (res) {
        that.setData({
          sessionCode: res.code
        })
      },
    })

  },
  // 跳转首页
  clicktoindex() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index'
    });
  },
  // 跳转我的
  clicktomy() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/my/my'
    });
  },
  // 跳转问卷
  clicktoquestion() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false;
    app.globalData.innerAudioContext.pause();
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity/index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/activity/index/index'
      })
    }

  },
  // 跳转视频
  clicktovideo() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false;
    app.globalData.innerAudioContext.pause();
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/video/index/index'
      })
    }

  },
  // 跳转游戏
  clicktogame() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false;
    app.globalData.innerAudioContext.pause();
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/game/index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/game/index/index'
      })
    }

  },
  // 获取分享数据
  getShareInfo() {
    let that = this;

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