// pages/activity1/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: '小海·燃计划', // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      bgColor: 'transparent',
      showTitle: true,
    },
    scrollTop: 0,
    isMusic: false,
    // 用户数据
    visitor_base_info: {
      nickname: '',
      avatar: '',
      openId: 'vnauishgiaafghah',
      phone: '',
    },
    is_rule: false,
    imgsrc: 'https://small.moreedge.cn/zh_smallxcx/activity1/',
    family: [{
        text: '单人居住',
        sure: false,
        value: '0',
      },
      {
        text: '两口之家',
        sure: false,
        value: '1',
      },
      {
        text: '三口之家',
        sure: false,
        value: '2',
      },
      {
        text: '二孩家庭',
        sure: false,
        value: '3',
      },
      {
        text: '三代同堂一孩',
        sure: false,
        value: '4',
      },
      {
        text: '三代同堂二孩',
        sure: false,
        value: '5',
      },
      {
        text: '多孩家庭',
        sure: false,
        value: '6',
      },
      {
        text: '其他',
        sure: false,
        value: '7',
      }
    ],
    focus_if: '1',
    dota: {},
    shareTitle: '',
    shareImg: '',
    searchCity: '',
    cityList: [],
    chooseCityId:-1,
    chooseCityName:'深圳',
    YzdataInfo: {
      openid: '',
      nickname: '',
      head: '',
      is_yz: '',
      family_type: '',
      name: '',
      tel: '',
      city: '',
      village: '',
      roomnum: '',
      sjs: 0,
      // address: '',
    },
    sfpicker: ['济南', '南京', '青岛', '上海', '烟台', '苏州', '宁波', '无锡', '杭州', '深圳', '东莞', '佛山', '厦门', '广州', '南昌', '珠海', '长沙', '福州', '海南', '沈阳', '大连', '北京', '北京新城', '天津', '哈尔滨', '长春', '石家庄', '重庆', '郑州', '西安', '太原', '新疆', '武汉', '成都', '昆明', '贵阳'],
    sessionCode: '',
    isdetail:false,
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    let _this = this
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight
    }
    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      _this.setData({
        ['defaultData.showTitle']: false
      })
      //向下滚动
    } else {
      if (ev.scrollTop < 20) {
        _this.setData({
          ['defaultData.showTitle']: true
        })
      }

      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  },
  onLoad(options) {
    let that = this
    let sjs = Math.floor(Math.random() * 100000)
    this.setData({
      sjs: sjs
    })
    // wx.setStorageSync('visitor_base_info', {
    //   nickname: 'nickname',
    //   avatar: 'https://small.moreedge.cn/zh_smallxcx/api/uploads/img/rhxmrwibk30i.jpeg',
    //   openId: 'o-pQM5uSxuGat9mdMSM0zsGZhgoc',
    //   phone: '261684684446',
    //   is_yz: 1
    // })
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({
        url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index')
      })
    }
    let proprietor = wx.getStorageSync('is_proprietor')
    if (app.globalData.isMusic) {
      app.globalData.innerAudioContext.play()
    } else {
      app.globalData.innerAudioContext.pause()
    }
    this.setData({
      visitor_base_info: git,
      ['YzdataInfo.openid']: git.openId,
      ['YzdataInfo.nickname']: git.nickname,
      ['YzdataInfo.head']: git.avatar,
      ['YzdataInfo.is_yz']: proprietor,
      isMusic: app.globalData.isMusic,
    })
    this.getpageinfo()
    this.getShareInfo()
    this.getSessionCode()
    setTimeout(function(){
      if(wx.getStorageSync('isdetail')){
        that.setData({
          isdetail:true
        })
        wx.setStorageSync('isdetail',false)
      }
    },500)
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
  // 获取当前页数据
  getpageinfo() {
    let that = this
    let git = wx.getStorageSync('visitor_base_info')
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getIndexPageInfo.php',
      method: 'POST',
      data: {
        'openid': this.data.visitor_base_info.openId,
        tel:git.phone
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          dota: res.data.data
        })
      },
    })
  },
  // 跳转活动
  clicktoac() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/activity/activity'
    })
  },
  clicktovideolist(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/list/index'
    })
  },
  // 跳转我的
  clicktomy() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/my/my'
    })
  },
  // 跳转问卷
  clicktoquestion() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false
    app.globalData.innerAudioContext.pause()
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
  // 点赞
  clickzan(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let i = +e.currentTarget.dataset.index
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/addVideoHelp.php',
      method: 'POST',
      data: {
        'openid': that.data.visitor_base_info.openId,
        vid: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            ['dota.videoList[' + i + '].help_number']: +that.data.dota.videoList[i].help_number + 1,
            ['dota.videoList[' + i + '].is_zan']: 1,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      },
    })
  },
  // 上传步数
  uploadrun() {
    let that = this
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
            openid: that.data.visitor_base_info.openId,
            encryptedData: res.encryptedData,
            iv: res.iv,
            sessionKeyCode: that.data.sessionCode,
          },
          success(res) {
            that.getSessionCode()
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
  // 跳转视频
  clicktovideo() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false
    app.globalData.innerAudioContext.pause()
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
  // 跳转视频详情
  clicktovideod(e) {
    let id = e.currentTarget.dataset.id
    let detail = e.currentTarget.dataset.detail
    wx.setStorageSync('detail',detail)
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id + '&prevPage=/pages/thirdPartyActivity/activity1/index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id + '&prevPage=/pages/thirdPartyActivity/activity1/index/index'
      })
    }
  },
  // 跳转游戏
  clicktogame() {
    this.setData({
      isMusic: false
    })
    app.globalData.isMusic = false
    app.globalData.innerAudioContext.pause()
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
  searchCity(e) {
    this.setData({
      searchCity: e.detail.value
    })
  },
  // 提交城市信息
  submitYZpage() {
    let that = this
    let git = wx.getStorageSync('visitor_base_info');
    let chooseCityId = that.data.chooseCityId;
    let chooseCityName = that.data.chooseCityName;
    if(chooseCityId=="-1"){
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    wx.showLoading({
      title: '数据提交中'
    })
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/addCity.php',
      method: 'POST',
      data: {
        openid:git.openId,
        city:chooseCityName,
        nickname:git.nickname,
        head:git.avatar,
        is_yz:git.is_yz,
        tel:git.phone
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          // wx.showToast({
          //   title: '信息提交成功',
          //   icon: 'success',
          //   duration: 2000,
          // })
          that.setData({
            ['dota.is_show_input']: 0,
            ['dota.cityPm']: res.data.data.cityPm,
            ['dota.city']: res.data.data.city,
            ['dota.countyPm']: res.data.data.countyPm,
            ['dota.cityPrevThreeList']: res.data.data.cityPrevThreeList,
            ['dota.cityOtherList']: res.data.data.cityOtherList,
            ['dota.countyPrevThree']: res.data.data.countyPrevThree,
            ['dota.countyOtherThree']: res.data.data.countyOtherThree,
            ['dota.userInfo']: res.data.data.userInfo,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000,
          })
        }
      },
      fail(){
        wx.hideLoading();
      }
    })
  },
  //查询城市列表
  getCityList() {
    let that = this
    let searchCity = that.data.searchCity.trim();
    if (searchCity == "") {
      wx.showToast({
        title: "请输入所在城市首字母",
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getCityList.php',
      method: 'POST',
      data: {
        szm: searchCity
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status == 1) {
         
          that.setData({
            cityList:res.data.list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000,
          })
        }
      },
      fail(){
        wx.showToast({
          title: "访问人数过多，请重新进入小程序",
          icon: 'error',
          duration: 2000,
        })
      }
    })
  },
  //选择城市
  chooseCity(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let chooseCityName = e.currentTarget.dataset.city;
    that.setData({
      chooseCityId:id,
      chooseCityName:chooseCityName
    })
  },
  goHome(){
    wx.redirectTo({
      url: '/pages/exhibitionHall/index',
    })
  },
  // 打开规则
  clickrule() {
    this.setData({
      is_rule: true
    })
  },
  // 关闭规则
  closerule() {
    this.setData({
      is_rule: false
    })
  },
  // 切换榜单
  changefocus(e) {
    this.setData({
      focus_if: e.currentTarget.dataset.id
    })
  },
  // 签到
  signin(e) {
    let that = this
    if (e.currentTarget.dataset.id == 0) {
      return
    } else {
      // 签到
      wx.request({
        url: 'https://small.moreedge.cn/zh_smallxcx/api/addQdInfo.php',
        method: 'POST',
        data: {
          'openid': this.data.visitor_base_info.openId
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
              ['dota.lx_qd_num']: res.data.data.lx_qd_num,
              ['dota.userInfo.score']: res.data.data.score,
              ['dota.qdList']: res.data.data.qdList,
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
  // 播放音乐
  music() {
    if (this.data.isMusic) {
      this.setData({
        isMusic: false
      })
      app.globalData.isMusic = false
      app.globalData.innerAudioContext.pause()
    } else {
      this.setData({
        isMusic: true
      })
      app.globalData.isMusic = true
      app.globalData.innerAudioContext.play()
    }
  },
  // 获取分享数据
  getShareInfo() {
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getShareInfo.php',
      method: 'POST',
      data: {
        'openid': this.data.visitor_base_info.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          shareTitle: res.data.shareTitle,
          shareImg: res.data.shareImg,
        })
      },
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
        console.log(res)
      },
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
      imageUrl: this.data.shareImg,
    }
  },

})