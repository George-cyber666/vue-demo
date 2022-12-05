// pages/activity1/my/myprize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: "我的奖品", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox:false,
      bgColor: 'transparent'
    },
    imgsrc:'https://small.moreedge.cn/zh_smallxcx/activity1/',
    shareTitle:'',
    shareImg:'',
    isMusic: false,
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
      address: ''
    },
    sfpicker: ['济南', '南京', '青岛', '上海', '烟台', '苏州', '宁波', '无锡', '杭州', '深圳', '东莞', '佛山', '厦门', '广州', '南昌', '珠海', '长沙', '福州', '海南', '沈阳', '大连', '北京', '北京新城', '天津', '哈尔滨', '长春', '石家庄', '重庆', '郑州', '西安', '太原', '乌鲁木齐', '武汉', '成都', '昆明', '贵阳'],
    dota:{}
  },
  onLoad(){
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
    this.getMyPrizePageInfo()
    if(app.globalData.isMusic){
      app.globalData.innerAudioContext.play();
    }else {
      app.globalData.innerAudioContext.pause();
    }
    this.setData({
      isMusic:app.globalData.isMusic
    })
  },
  // 获取页面数据
  getMyPrizePageInfo(){
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getMyPrizePageInfo.php',
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
            dota:res.data.data
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
  // 提交奖品信息
  clicksubmit(){
    let that = this
    console.log(this.data.dota.userInfo.name);
    if(this.data.dota.userInfo.name == ''){
      console.log(this.data.dota.userInfo.name);
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.dota.userInfo.tel == '' || this.data.dota.userInfo.tel.length < 11){
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.dota.userInfo.city == ''){
      wx.showToast({
        title: '请选择所在城市',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.dota.userInfo.village == ''){
      wx.showToast({
        title: '请填写项目名称',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.dota.userInfo.address == '' || this.data.dota.userInfo.address == null){
      wx.showToast({
        title: '请填写收件地址',
        icon: 'none',
        duration: 2000
      })
    }else {
      let params = {
        openid:wx.getStorageSync('visitor_base_info').openId,
        name:this.data.dota.userInfo.name,
        tel:this.data.dota.userInfo.tel,
        city:this.data.dota.userInfo.city,
        village:this.data.dota.userInfo.village,
        address:this.data.dota.userInfo.address
      }
      wx.request({
        url: 'https://small.moreedge.cn/zh_smallxcx/api/addGetPrizeInfo.php',
        method: 'POST',
        data: {
          ...params
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.status == 1) {
            wx.showToast({
              title: '奖品信息提交成功',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              ['dota.is_enter']:1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
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
  // 业主姓名修改
  changename(e) {
    this.setData({
      ['dota.userInfo.name']: e.detail.value
    })
  },
  // 业主电话修改
  changephone(e) {
    this.setData({
      ['dota.userInfo.tel']: e.detail.value
    })
  },
  // 选择城市
  sfpickerc(e) {
    var e = e.detail.value
    let items = this.data.sfpicker
    this.setData({
      ['dota.userInfo.city']: items[e]
    })
  },
  // 所在小区修改
  changevillage(e) {
    this.setData({
      ['dota.userInfo.village']: e.detail.value
    })
  },
  // 收件地址修改
  changeaddress(e) {
    this.setData({
      ['dota.userInfo.address']: e.detail.value
    })
  },
  // 跳转首页
  clicktoindex(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index'
    });
  },
  // 跳转活动
  clicktoac(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/activity/activity'
    });
  },
  // 跳转我的
  clicktomy(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/my/my'
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
  addShareNum(){
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/addShareNum.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
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