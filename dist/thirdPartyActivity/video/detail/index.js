// pages/video/detail/index.js
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
      showViewBox:false,
      showTitle:true,
      bgColor: 'transparent'
    },
    imgsrc:'https://small.moreedge.cn/zh_smallxcx/video/',
    //videoSrc:'http://qn.moreedge.cn/video1.mp4',
    video_path:'',
    nickname:'',
    createymd:'',
    help_number:0,
    is_zan:0,
    requestUrl:'https://small.moreedge.cn/zh_smallxcx/api/',
    shareImg: '',
    shareTitle: '',
    id:'',
    prevPage:'/pages/thirdPartyActivity/activity1/index/index'
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
      success: function(res) {
        
      },
      fail: function(res) {}
    });
  },
  back(){
    if(this.data.prevPage=="/pages/thirdPartyActivity/video/list/index"){
      wx.redirectTo({
        url: this.data.prevPage,
      })
    }else{
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/activity1/index/index',
      })
      wx.setStorageSync('isdetail',true)
    }
    
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
  //获取视频详情
  getVideoDetailPageInfo(openId,vid) {
    var that = this;
    wx.request({
      url: that.data.requestUrl + 'getVideoDetailPageInfo.php',
      method: 'POST',
      data: {
        openid:openId,
        vid: vid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == "1") {
          var videoInfo = res.data.data.videoInfo;
          that.setData({
            video_path:videoInfo.video_path,
            nickname:videoInfo.nickname,
            createymd:videoInfo.createymd,
            help_number:videoInfo.help_number,
            is_zan:videoInfo.is_zan
          })
          if(videoInfo.sh_status==0||videoInfo.sh_status==2){
            wx.hideShareMenu();
          }else if(videoInfo.sh_status==1){
            wx.showShareMenu()
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
    //视频点赞接口
    addVideoHelp() {
      var that = this;
      let git = wx.getStorageSync('visitor_base_info');
      wx.request({
        url: that.data.requestUrl + 'addVideoHelp.php',
        method: 'POST',
        data: {
          openid: git.openId,
          vid: that.data.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == "1") {
            //点赞成功
            let help_number = that.data.help_number;
            let is_zan = that.data.is_zan;
            is_zan = "1";
            help_number++;
            that.setData({
              is_zan:is_zan,
              help_number:help_number
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let git = wx.getStorageSync('visitor_base_info');
    var that = this;
    //调用分享
    that.getShareInfo();
    var id = options.id;
    var prevPage = options.prevPage;
    that.setData({
      prevPage:prevPage
    })
    if(id==""||id=="undefined"){
      wx.redirectTo({
        url: '/pages/thirdPartyActivity/video/list/index',
      })
    }else{
      that.setData({
        id:id
      })
    }
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({
        url: 'pages/common/zhOutSourcePageAuth/index?redirect='+encodeURIComponent('/pages/thirdPartyActivity/video/detail/index?id'+id),
      })
    }else{
      that.getVideoDetailPageInfo(git.openId,id)
    }
    
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var that = this;
    that.addShareNum();
    return {
      title: that.data.shareTitle,
      path: '/pages/thirdPartyActivity/video/detail/index?id='+that.data.id,
      imageUrl: that.data.shareImg,
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  }
})