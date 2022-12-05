// pages/video/upload/index.js
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
    videoUrl: '',
    video_path: '',
    img_path: '',
    uploadImg:[],
    requestUrl:'https://small.moreedge.cn/zh_smallxcx/api/',
    shareImg: '',
    shareTitle: '',
    duration:'',//上传的视频时间
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
      success: function(res) {
        that.setData({
          shareTitle: res.data.shareTitle,
          shareImg: res.data.shareImg
        });
      },
      fail: function(res) {}
    });
  },
  goVideoList(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/list/index',
    })
  },
  goMyVideo(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/myvideo/index',
    })
  },
  goUpload(){
    wx.redirectTo({
      url: '/pages/thirdPartyActivity/video/upload/index',
    })
  },
  chooseVideo() {
    let that = this;
    //1.拍摄视频或从手机相册中选择视频
    wx.chooseVideo({
      sourceType: ['album','camera'], // album 从相册选视频，camera 使用相机拍摄 'album',
      maxDuration: 30, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back', //默认拉起的是前置或者后置摄像头，默认back, front = 前置摄像头
      compressed: true, //是否压缩所选择的视频文件
      success(res) {
        let tempFilePath = res.tempFilePath //选择定视频的临时文件路径（本地路径）
        let duration = res.duration //选定视频的时间长度
        that.setData({
          duration:duration
        })
        let size = parseFloat(res.size / 1024 / 1024) //选定视频的数据量大小
        // let size = parseFloat(res.size/1024/1024).toFixed(1)  //选定视频的数据量大小
        // let height = res.height //返回选定视频的高度
        // let width = res.width //返回选中视频的宽度
        console.log('大小==', res.size, '高度==', res.height, '宽度==', res.width)
        console.log('視頻大小', size)
        console.log(tempFilePath)
        // that.data.duration = duration
        if (parseFloat(size) > 100) {
          wx.showToast({
            title: '上传的视频大小超限，超出 100 MB,请重新上传',
            icon: 'none'
          })
        } else {
          //2.本地视频资源上传到服务器
          that.uploadFile(tempFilePath)
          
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  upload(){
    var that = this;
    let git = wx.getStorageSync('visitor_base_info');
    if(that.data.video_path==""){
      wx.showToast({
        title: '请上传视频',
        icon: 'none'
      });
    }else if(that.data.img_path==""){
      wx.showToast({
        title: '请上传视频封面图',
        icon: 'none'
      });
    }else if(that.data.duration > 30){
      wx.showToast({
        title: '上传视频不能超过30秒',
        icon: 'none'
      });
    }else{
      wx.showLoading({
        title: '上传中',
        mask: true //是否显示透明蒙层，防止触摸穿透
      });
      wx.request({
        url: that.data.requestUrl + 'uploadMyVideo.php',
        method: 'POST',
        data: {
          openid:git.openId,
          video_path:that.data.video_path,
          img_path:that.data.img_path
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          wx.hideLoading()
          if(res.data.status=="1"){
            wx.showToast({
              title: '上传成功，正在审核中',
              icon: 'none'
            });
            var timeout = setTimeout(function(){
              wx.redirectTo({
                url: '/pages/thirdPartyActivity/video/list/index',
              });
              clearTimeout(timeout)
            },2000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: "上传失败，请重试",
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  },
  /**
   * 将本地资源上传到服务器
   * 
   */
  uploadFile(tempFilePath) {
    let that = this

    const uploadTask = wx.uploadFile({
      url:that.data.requestUrl + 'uploadVideo.php' , //开发者服务器地址
      filePath: tempFilePath, //要上传文件资源的路径（本地路径）
      name: 'file', //文件对应key,开发者在服务端可以通过这个 key 获取文件的二进制内容
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'multipart/form-data'
      },
      success(res) {
        console.log("res:",res)
        wx.hideLoading()
        if(res.statusCode == 200){
          if(res.data=="-1"){
            wx.showToast({
              title: '感谢您的参与,活动已经结束了哦',
              icon: 'none'
            });
          }else if(res.data=="-2"){
            wx.showToast({
              title: '抱歉,未获取到视频信息哦',
              icon: 'none'
            });
          }else if(res.data=="-3"){
            wx.showToast({
              title:'上传视频的大小不能超过100M哦',
              icon: 'none'
            });
          }else{
            that.setData({
              videoUrl:tempFilePath,
              video_path:res.data
            })
          }
        }else{
          wx.showToast({
            title: '上传视频失败',
            icon: 'none'
          })
        }
       
       
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '上传视频失败',
          icon: 'none'
        })
      }
    })
    //监听上传进度变化事件
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '上传中',
        mask: true //是否显示透明蒙层，防止触摸穿透
      })
      // console.log("上传进度", res.progress)
    })
  },
  uploadFile2(tempFilePath) {
    let that = this;
    console.log("图片",tempFilePath)
    const uploadTask = wx.uploadFile({
      url:that.data.requestUrl + 'uploadFmt.php' , //开发者服务器地址
      filePath: tempFilePath, //要上传文件资源的路径（本地路径）
      name: 'file', //文件对应key,开发者在服务端可以通过这个 key 获取文件的二进制内容
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'multipart/form-data'
      },
      success(res) {
        console.log("res:",res)
        wx.hideLoading()
        if(res.statusCode == 200){
          if(res.data=="-1"){
            wx.showToast({
              title: '感谢您的参与,活动已经结束了哦',
              icon: 'none'
            });
          }else if(res.data=="0"){
            wx.showToast({
              title: '抱歉,未获取到封面图信息',
              icon: 'none'
            });
          }else{
            that.setData({
              img_path:res.data
            })
          }
        }else{
          wx.showToast({
            title: '上传视频封面图失败',
            icon: 'none'
          })
        }
       
      
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '上传视频封面图失败',
          icon: 'none'
        })
      }
    })
  },
  chooseImageTap(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        that.setData({
          uploadImg: res.tempFilePaths
        })
        that.uploadFile2(res.tempFilePaths[0])
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    //调用分享
    that.getShareInfo();
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
    success: function(res) {
      
    },
    fail: function(res) {}
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