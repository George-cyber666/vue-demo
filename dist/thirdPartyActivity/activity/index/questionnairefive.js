// pages/activity/index/questionnairefive.js
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
    option:'',
    shareTitle:'',
    shareImg:'',
    show:false
  },
  onLoad(op){
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
  },
  changeinp(e) {
    this.setData({
      option: e.detail.value
    })
  },
  clicktoplan(){
    let that = this
    if(this.data.option==''){
      wx.showToast({
        icon: 'none',
        title: '请填写建议',
        duration: 2000
      });
    }else {
      let str = [...wx.getStorageSync('answerArr'),this.data.option]
      wx.setStorageSync('answerArr', str)
      let userInfoArr = JSON.stringify(wx.getStorageSync('userInfoArr'))
      let answerArr = JSON.stringify(wx.getStorageSync('answerArr'))
      wx.request({
        url: 'https://small.moreedge.cn/zh_smallxcx/api/addWjInfo.php',
        method: 'POST',
        data: {
          openid: wx.getStorageSync('visitor_base_info').openId,
          userInfoArr: userInfoArr,
          answerArr:answerArr
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.status == 1) {
            that.setData({
              show:true
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
  // 返回首页
  clicktoindex(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index'
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
