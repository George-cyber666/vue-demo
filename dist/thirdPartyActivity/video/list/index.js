// pages/video/list/index.js
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
    sfpicker: ['全国','济南', '南京', '青岛', '上海', '烟台', '苏州', '宁波', '无锡', '杭州', '深圳', '东莞', '佛山', '厦门', '广州', '南昌', '珠海', '长沙', '福州', '海南', '沈阳', '大连', '北京', '北京新城', '天津', '哈尔滨', '长春', '石家庄', '重庆', '郑州', '西安', '太原', '乌鲁木齐', '武汉', '成都', '昆明', '贵阳'],
    sfpicker_text:'全国',
    videoList: [],
    showRule: false,
    page: 1,
    dataBack: true, //触底加载
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
  goHome() {
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/activity1/index/index',
    })
  },
  goDetail(e) {
    var id = e.currentTarget.dataset.id;
    if (getCurrentPages().length > 9) {
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id+'&prevPage=/pages/thirdPartyActivity/video/list/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/thirdPartyActivity/video/detail/index?id=' + id+'&prevPage=/pages/thirdPartyActivity/video/list/index',
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
            videoList: videoList
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
    that.getVideoPageInfo(git.openId);
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
    var that = this;
    if (that.data.dataBack) {
      console.log("进入方法")
      // 调用追加数据方法
      let git = wx.getStorageSync('visitor_base_info');
      that.getVideoPageInfo(git.openId)
      that.setData({
        dataBack: false,
      });
    }
  },
  //获取视频列表页
  getVideoPageInfo(openid) {
    var that = this;
    wx.request({
      url: that.data.requestUrl + 'getVideoPageInfo.php',
      method: 'POST',
      data: {
        openid: openid,
        page: that.data.page,
        city:that.data.sfpicker_text
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)
        wx.setStorageSync('is_end', res.data.data.is_end);
        if (res.data.status == 1) {
          if (res.data.data.videoList.length > 0) {
            var videoList = that.data.videoList.concat(res.data.data.videoList);
            that.setData({
              videoList: videoList,
              page: that.data.page + 1,
              dataBack: true
            })
          }

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
  // 选择城市
  sfpickerc(e) {
    let that = this
    var e = e.detail.value
    let items = this.data.sfpicker
    this.setData({
      sfpicker_text: items[e],
      page:1,
      videoList: []
    })
    let git = wx.getStorageSync('visitor_base_info');
    that.getVideoPageInfo(git.openId)
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