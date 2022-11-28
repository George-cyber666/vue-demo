const app = getApp()
Component({
  properties: {
    // defaultData（父页面传递的数据）
    defaultData: {
      type: Object,
      value: {
        title: "我是默认标题",
        showHome: false,
        showBack: true,
        showLogo:false,
        showViewBox:false,
        showTitle:true,
        bgColor:'',
        goUrl:''
      },
      observer: function (newVal, oldVal) {}
    }
  },



  data: {
    baseUrl:'https://small.andwind.cc/ly_small_service/',//app.baseUrl,
    version:app.version,
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    
  },
  attached: function () {

  },
  methods: {
    goBack(e){
      console.log(e)
      var url = e.currentTarget.dataset.url;
      if(url){
        wx.redirectTo({
          url: url,
        })
      
      }else{
        wx.navigateBack({
          delta: 1
        });
      }
     
    },
    goHome(){
      wx.redirectTo({
        url: '/pages/index/index/index',
      })
    }
  }
})