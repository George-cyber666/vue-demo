
const app = getApp();
Page({
  data: {
    defaultData: {
      title: "问卷调查", // 导航栏标题
      showHome: false, //是否显示回到首页按钮
      showBack: false, //是否显示返回按钮
      showLogo: false, //是否显示logo
      showViewBox: false,
      showTitle: true,
      bgColor: 'transparent'
    },
    str: ['0', '1', '2', '3', '4', '5', '6', '7'],
    strarray: ['亲子类活动-手工、出游、趣味赛', '球类经济活动-篮球、羽毛球、乒乓球等', '运动类活动-彩虹跑、趣味运动会', '艺术类活动-观影、K歌', '公益类活动-志愿者服务、以物易物', '游戏类-王者荣耀、麻将、掼蛋', '知识讲座-健康、消防、学校', '其他-'],
    indexid: '',
    option: [],
    optionChoose: [false, false, false, false, false, false, false, false],
    inpoption: '',
    inpoption1: '',
    shareTitle: '',
    shareImg: ''
  },
  onLoad() {
    let git = wx.getStorageSync('visitor_base_info')
    if (!git || !git.nickname || git.nickname === 'undefined' || !git.phone) {
      wx.redirectTo({ url: '/pages/common/zhOutSourcePageAuth/index?redirect=' + encodeURIComponent('/pages/thirdPartyActivity/activity1/index/index') })
    }
    this.getShareInfo()
  },
  changeinp(e) {
    this.setData({
      inpoption:e.detail.value,
    })
  },
  clickcheck(e) {
    var id = e.currentTarget.dataset.id;
    let items = this.data.str;
    var optionChoose = this.data.optionChoose;
    var optionArr = this.data.option;
    if (id != 7) {
      var index = optionArr.findIndex((value, index, arr) => {
        return value == this.data.strarray[id]
      })

      if (optionArr.length < 3) {
        if (optionChoose[id]) {
          optionChoose[id] = false;
          if (index > -1) {
            optionArr.splice(index, 1);
          }
        } else {
          optionChoose[id] = true;
          optionArr.push(this.data.strarray[id]);
        }

      } else {
        if (index != -1) {
          optionChoose[id] = false;
          optionArr.splice(index, 1);
        } else {
          wx.showToast({
            icon: 'none',
            title: '只能选择三种类型',
            duration: 2000
          });
        }

      }
    } else {
      var index = optionArr.findIndex((value, index, arr) => {
        return value == '其他-'

      })

      if (optionArr.length < 3) {
        if (optionChoose[id]) {
          optionChoose[id] = false;
          if (index > -1) {
            optionArr.splice(index, 1);
          }
        } else {
          optionChoose[id] = true;
          optionArr.push(this.data.strarray[id]);
        }

      } else {
        if (index != -1) {
          optionChoose[id] = false;
          optionArr.splice(index, 1);
        } else {
          wx.showToast({
            icon: 'none',
            title: '只能选择三种类型',
            duration: 2000
          });
        }

      }
    }

    this.setData({
      optionChoose: optionChoose,
      option: optionArr
    })
    // for (let i = 0, lenI = items.length; i < lenI; ++i) {
    //   if (items[i] == id) {
    //     this.setData({
    //       indexid:id,
    //       option:this.data.strarray[id],
    //     })
    //     break
    //   }
    // }
  },
  clicktoplan() {
    var optionArr = this.data.option;

    if (optionArr.length < 3) {
      wx.showToast({
        icon: 'none',
        title: '请选择三种类型',
        duration: 2000
      });
    } else {
      var index = optionArr.findIndex((value, index, arr) => {
        return value == '其他-'
      })
      if (index != -1 && this.data.inpoption == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写选项',
          duration: 2000
        });
      } else {
        var optionStr = '';
        var index = optionArr.findIndex((value, index, arr) => {
          return value == '其他-'
        })
        if(index>-1){
          optionArr[index] = '其他-'+ this.data.inpoption;
          this.setData({
            option:optionArr
          })
        }
        optionStr = optionArr.join(',');
        wx.setStorageSync('answerArr', [optionStr])
        wx.redirectTo({
          url: '/pages/thirdPartyActivity/activity/index/questionnairetwo'
        });
        
      }
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
  addShareNum() {
    wx.request({
      url: 'https://small.moreedge.cn/zh_smallxcx/api/addShareNum.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
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
