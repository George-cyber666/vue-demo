// pages/thirdPartyActivity/activity/index/shade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: "问卷调查", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      showTitle: true,
      bgColor: 'transparent',
    },
    sfpicker: ['济南', '南京', '青岛', '上海', '烟台', '苏州', '宁波', '无锡', '杭州', '深圳', '东莞', '佛山', '厦门', '广州', '南昌', '珠海', '长沙', '福州', '海南', '沈阳', '大连', '北京', '北京新城', '天津', '哈尔滨', '长春', '石家庄', '重庆', '郑州', '西安', '太原', '新疆', '武汉', '成都', '昆明', '贵阳'],
    dota: {
      name: '',
      tel: '',
      city: '',
      inp: '',
      adr: '',
      sfz: ''
    }
  },
  onLoad(){
    this.getpagedotacity()
  },
  changeinp1(e){
    this.setData({
      ['dota.name']:e.detail.value,
    })
  },
  changeinp2(e){
    this.setData({
      ['dota.tel']:e.detail.value,
    })
  },
  changeinp3(e){
    var e = e.detail.value
    console.log(e);
    let items = this.data.sfpicker
    this.setData({ 
      ['dota.city']: items[e]
    })
  },
  changeinp4(e){
    this.setData({
      ['dota.inp']:e.detail.value,
    })
  },
  changeinp5(e){
    this.setData({
      ['dota.adr']:e.detail.value,
    })
  },
  changeinp6(e){
    this.setData({
      ['dota.sfz']:e.detail.value,
    })
  },
  clicktoplan(){
    if(this.data.dota.name == ''){
      wx.showToast({
        title: '请填写业主姓名',
        icon: 'none',
        duration: 2000,
      })
    }else if (this.data.dota.tel == '' || this.data.dota.tel.length < 11){
      wx.showToast({
        title: '请填写11位的联系电话',
        icon: 'none',
        duration: 2000,
      })
    }else if (this.data.dota.inp == ''){
      wx.showToast({
        title: '请填写项目名称',
        icon: 'none',
        duration: 2000,
      })
    }else if (this.data.dota.adr == ''){
      wx.showToast({
        title: '请填写房间号',
        icon: 'none',
        duration: 2000,
      })
    }else if (this.data.dota.sfz == '' || this.data.dota.sfz.length < 6){
      wx.showToast({
        title: '请填写身份证后6位',
        icon: 'none',
        duration: 2000,
      })
    }else {
      wx.setStorageSync('userInfoArr', [this.data.dota.name,this.data.dota.tel,this.data.dota.city,this.data.dota.inp,this.data.dota.adr,this.data.dota.sfz])
      // console.log(wx.getStorageSync('userInfoArr'));
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity/index/questionnaireone'
      });
    }
  },
  getpagedotacity(){
    let that =this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getMyChooseCity.php',
      method: 'POST',
      data: {
        'openid': wx.getStorageSync('visitor_base_info').openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          ['dota.city']: res.data.city
        })
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