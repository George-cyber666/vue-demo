// index.js
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
    shareTitle:'',
    shareImg:'',
    isAdd:0,
    is_end:0
  },
  onLoad(){
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
    this.getWjPageInfo()
  },
  // 获取页面数据
  getWjPageInfo(){
    let that = this
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/getWjPageInfo.php',
      method: 'POST',
      data: {
        'openid': wx.getStorageSync('visitor_base_info').openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          isAdd:res.data.data.isAdd,
          is_end:res.data.data.is_end
        })
      }
    })
  },
  clickto(){
    if(this.data.is_end == 1) {
      wx.showToast({
        title: '对不起,活动已结束',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.isAdd == 1){
      wx.showToast({
        title: '对不起,您已经提交过问卷了',
        icon: 'none',
        duration: 2000
      })
    }else {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity/index/shade'
      });
    }
  },
  // 跳转首页
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
