// pages/activity/index/questionnairefour.js
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
    str:['0','1','2','3','4'],
    strarray:['5分','4分','3分','2分','1分'],
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
  clickcheck(e){
    var id = e.currentTarget.dataset.id;
    let items = this.data.str
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i] == id) {
        this.setData({
          indexid:id,
          option:this.data.strarray[id]
        })
        break
      }
    }
    
  },
  clicktoplan(){
    if(this.data.option==''){
      wx.showToast({
        icon: 'none',
        title: '请选择一项',
        duration: 2000
      });
    }else {
      let str = [...wx.getStorageSync('answerArr'),this.data.option]
      wx.setStorageSync('answerArr', str)
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity/index/questionnairefive'
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
