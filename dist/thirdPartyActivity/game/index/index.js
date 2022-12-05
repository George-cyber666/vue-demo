// pages/game/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameUrl: 'https://small.moreedge.cn/zh_qzydh/',
    requestUrl: 'https://small.moreedge.cn/zh_smallxcx/api/',
    shareImg: '',
    shareTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let git = wx.getStorageSync('visitor_base_info');
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({
        url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index')
      })
    }
    let that = this;
    //调用分享
    that.getShareInfo();

   
    that.setData({
      gameUrl:that.data.gameUrl+"?openid="+git.openId
    })
  },
  //获取微信分享信息
  getShareInfo() {
    var that = this;
    wx.request({
      url: that.data.requestUrl + 'getShareInfo.php',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          shareTitle: res.data.shareTitle,
          shareImg: res.data.shareImg
        });
      },
      fail: function (res) {}
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  //统计页面分享数量
  addShareNum() {
    var that = this;
    wx.request({
      url: that.data.requestUrl + 'addShareNum.php',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

      },
      fail: function (res) {}
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var that = this;
    that.addShareNum();
    return {
      title: that.data.shareTitle,
      path: '/pages/thirdPartyActivity/activity1/index/index',
      imageUrl: that.data.shareImg,
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  }
})