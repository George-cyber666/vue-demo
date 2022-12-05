// pages/video/myvideo/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultData: {
      title: "业主活动", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      showTitle:true,
      bgColor: '#F2F2F2'
    },
    imgsrc: 'https://small.moreedge.cn/zh_smallxcx/video/',
    requestUrl: 'https://small.moreedge.cn/zh_smallxcx/api/',
    shareImg: '',
    shareTitle: '',
    // 用户数据
    visitor_base_info: {
      nickname: '',
      avatar: '',
      openId: '',
      phone: '',
    },
    videoList: [],
    showRule: false
  },
  showRule() {
    this.setData({
      showRule: true
    });
  },
  hideRule() {
    this.setData({
      showRule: false
    });
  },
  goHome(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index',
    })
  },
  goDetail(e) {
    var id = e.currentTarget.dataset.id;
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id+'&prevPage=/pages/thirdPartyActivity/video/myvideo/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id+'&prevPage=/pages/thirdPartyActivity/video/myvideo/index',
      })
    }
  },
  goVideoList() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/list/index',
    })
  },
  goMyVideo() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/myvideo/index',
    })
  },
  goUpload() {
    var is_end = wx.getStorageSync('is_end');
    if (is_end != "1") {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/upload/index',
      })
    } else {
      wx.showToast({
        title: "感谢您的参与,活动已经结束了哦",
        icon: 'none',
        duration: 2000
      })
    }

  },
  //视频点赞接口
  addVideoHelp(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    let git = wx.getStorageSync('visitor_base_info');
    var videoIndex = e.currentTarget.dataset.index;
    console.log(videoIndex)
    wx.request({
      url: that.data.requestUrl + 'addVideoHelp.php',
      method: 'POST',
      data: {
        openid: git.openId,
        vid: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == "1") {
          //点赞成功
          let videoList = that.data.videoList;
          videoList[videoIndex].is_zan = "1";
          videoList[videoIndex].help_number++;
          that.setData({
            videoList:videoList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {}
    });
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
    that.getMyVideoList(git.openId);
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
  //获取视频列表页
  getMyVideoList(openid) {
    var that = this;
    wx.request({
      url: that.data.requestUrl + 'getMyVideoList.php',
      method: 'POST',
      data: {
        openid: openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        wx.setStorageSync('is_end', res.data.data.is_end);
        if (res.data.status == 1) {
          that.setData({
            videoList: res.data.data.list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {}
    });
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