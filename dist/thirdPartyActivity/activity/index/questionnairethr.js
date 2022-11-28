// pages/activity/index/questionnairethr.js

const app = getApp();
Page({
  data: {
    defaultData: {
      title: "问卷调查", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox:false,
      showTitle:true,
      bgColor: 'transparent'
    },
    dota:{
      nub1:'',
      nub2:'',
      nub3:'',
      nub4:'',
    },
    indexid:'',
    option:'',
    shareTitle:'',
    shareImg:''
  },
  onLoad(op){
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
  },
  changeinp1(e){
    this.setData({
      ['dota.nub1']:e.detail.value,
    })
  },
  changeinp2(e){
    this.setData({
      ['dota.nub2']:e.detail.value,
    })
  },
  changeinp3(e){
    this.setData({
      ['dota.nub3']:e.detail.value,
    })
  },
  changeinp4(e){
    this.setData({
      ['dota.nub4']:e.detail.value,
    })
  },
  clicktoplan(){
    if(this.data.dota.nub1==''){
      wx.showToast({
        icon: 'none',
        title: '请填写必填项',
        duration: 2000
      });
    }else {
      let arr = this.data.dota.nub1 + '岁'
      if(this.data.dota.nub2 !==''){
        arr = arr + ',' + this.data.dota.nub2 + '岁'
      }
      if(this.data.dota.nub3 !==''){
        arr = arr + ',' + this.data.dota.nub3 + '岁'
      }
      if(this.data.dota.nub4 !==''){
        arr = arr + ',' + this.data.dota.nub4 + '岁'
      }
      let str = [...wx.getStorageSync('answerArr'),arr]
      wx.setStorageSync('answerArr', str)
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity/index/questionnairefour'
      });
    }
    
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