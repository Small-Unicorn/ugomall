<template>
  <div :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll"></search>
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="banner.goods_id" v-for="banner in bannerList">
        <a :href="'/pages/goods/main?id=' + banner.goods_id">
          <img :src="banner.image_src" />
        </a>
      </swiper-item>
    </swiper>
    <!-- 导航条 -->
    <div class="navs">
      <!-- 
        navigator 跳转的页面如果是配置中的 tabBar 
        必须要指定 open-type 属性，并且值为 switchTab
      -->
      <a :href="nav.navigator_url || '/pages/list/main?query=' + nav.name" :open-type="nav.open_type || 'navigate'" :key="nav.name" v-for="nav in navList">
        <img :src="nav.image_src" />
      </a>
    </div>
    <!-- 楼层 -->
    <div class="floors">
      <div class="floor" :key="index" v-for="(floor, index) in floorList">
        <div class="title">
          <img :src="floor.floor_title.image_src" />
        </div>
        <div class="items">
          <a :href="'/pages/list/main?query=' + product.name" :key="key" v-for="(product, key) in floor.product_list">
            <img :src="product.image_src" />
          </a>
        </div>
      </div>
    </div>
    <!-- 回顶部 -->
    <div class="goTop" @click="goTop" v-show="scrollTop > 200"></div>
  </div>
</template>

<script>
  
  // 导入自定义搜索组件
  import search from '@/components/search';

  // wx.request 的 Promise 封装
  import request from '@/utils/request';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        // 轮播图数据
        bannerList: [],
        // 主导航数据
        navList: [],
        // 楼层数据
        floorList: [],
        // 滚动高度
        scrollTop: 0
      }
    },

    components: {
      search
    },
    
    methods: {

      // 回到页面顶部
      goTop () {
        // 通过调用小程序的 api 可以设置页面的滚动高度
        mpvue.pageScrollTo({
          scrollTop: 0
        })
      },

      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },

      // 轮播接口
      async getBannerList () {

        // mpvue 中建议将原有的 wx 这个命名空间，改写成 mpvue
        // 即 wx.request => mpvue.request 
        //    wx.showLoading => mpvue.showLoading
        //    ...

        // mpvue.request({
        //   url: ''
        // });

        // Promise 单独使用
        // request().then((info) => {
        //   console.log(info);
        // });

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/swiperdata'
        });

        // console.log(message);
        // 更新数据
        this.bannerList = message;
      },

      // 主导航接口
      async getNavList () {

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/catitems'
        });

        // console.log(message);
        // 更新数据
        this.navList = message;
      },

      // 楼层接口
      async getFloorList () {
        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/home/floordata'
        })

        // console.log(message);

        // 更新数据
        this.floorList = message;
      }
    },

    // created 被转换成了小程序的 onLaunch
    // created () {
    //   console.log('首页加载了...');
    // },

    // monted 被转成了小程序的 onLoad
    mounted () {
      // console.log('首页加载了...');

      // 调用轮播图接口
      this.getBannerList();

      // 调用主导航接口
      this.getNavList();

      // 调用楼层接口
      this.getFloorList();
    },

    // 监听用户下接操作
    async onPullDownRefresh () {
      // console.log('有人下拉了...');

      // 调用轮播图接口
      await this.getBannerList();

      // 调用主导航接口
      await this.getNavList();

      // 调用楼层接口
      await this.getFloorList();

      // 终止下接状态
      mpvue.stopPullDownRefresh();
    },

    // 监听用户滚动页面操作
    onPageScroll (ev) {
      // console.log(ev);
      this.scrollTop = ev.scrollTop;
    },

    // 当页面监听了 onShareAppMessage 事件后
    // 即为当前页面开启了转发（分享）功能
    onShareAppMessage() {
      // 该函数返回一个对象，即可实现自定义转发（分享）
      return {
        title: '快来和一起开发小程序吧!',
        path: '/pages/index/main',
        imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568545134795&di=b99de7dd878c08ef353fb608d5183bbd&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2Fv2-b6eaa303936d70791ba6785f88e07249_b.jpg'
      }
    },

    // 监听页面是否滚动到底部了
    // 当页面发生滚动时，并且滚动到底才会触发
    onReachBottom () {
      console.log('页面滚动到底儿了...');
    }
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    img {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floors {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding-top: 20rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      a {
        width: 232rpx;
        height: 188rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      a:nth-child(2n+1) {
        margin-right: 0;
      }

      a:first-child {
        height: 386rpx;
        margin-right: 10rpx;
      }
    }
  }
  
  .goTop {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
  }
</style>
