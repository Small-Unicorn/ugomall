<template>
  <div>
    <!-- 筛选 -->
    <div class="filter">
      <span class="active">综合</span>
      <span>销量</span>
      <span>价格</span>
    </div>
    <!-- 商品列表 -->
    <scroll-view @scrolltolower="getMore" class="goods" scroll-y>
      <div class="item" @click="goDetail(goods.goods_id)" :key="goods.goods_id" v-for="goods in goodsList">
        <!-- 商品图片 -->
        <image class="pic" :src="goods.goods_small_logo"></image>
        <!-- 商品信息 -->
        <div class="meta">
          <p class="name">{{goods.goods_name}}</p>
          <p class="price"><span>￥</span>{{goods.goods_price}}<span>.00</span></p>
        </div>
      </div>
      <div class="tips" v-show="!goodsList.length">没有找到相关的数据~</div>
    </scroll-view>
  </div>
</template>

<script>

  // 引入 wx.request 的 Promise 封装版本
  import request from '@/utils/request';

  export default {

    data () {
      return {
        // 商品列表
        goodsList: [],
        // 当前第几页
        pagenum: 1,
        // 每页取几条数据
        pagesize: 5,
        query: null,
        total: 0
      }
    },

    methods: {

      // 跳转到商品详情
      goDetail (id) {
        // 跳转api
        mpvue.navigateTo({
          url: '/pages/goods/main?id=' + id
        })
      },

      // 获取更多的数据
      async getMore () {
        // console.log('区域滚动到底部了');

        // 没有更多数据，终止请求
        if(this.goodsList.length >= this.total) return;

        // 配置页码相关参数
        this.query.pagenum = ++this.pagenum;
        this.query.pagesize = this.pagesize;

        // 请求更多数据
        const {message} = await request({
          url: '/api/public/v1/goods/search',
          data: this.query
        })

        // this.goodsList = message.goods;
        // var arr = [1, 2, 3];
        // var arr1 = [4, 5, 6];
        // arr.push(arr1); // [1, 2, 3, [4, 5, 6]]
        // console.log(message);
        this.goodsList = this.goodsList.concat(message.goods);

        // 记录数据总共有多少
        this.total = message.total;
      }
    },

    // 获得地址参数通过 onLoad 实现
    async onLoad (query) {
      // console.log(query);
      // 将地址参数赋值给初始数据
      this.query = query;

      // 配置页码相关参数
      query.pagenum = this.pagenum;
      query.pagesize = this.pagesize;
      // 根据址中参数，查询查应的商品列表
      const {message} = await request({
        url: '/api/public/v1/goods/search',
        data: query
      })

      // console.log(message);
      // 更新数据
      this.goodsList = message.goods;

      // 记录数据总共有多少
      this.total = message.total;
    },

    // 监听页面是否滚动到底部了
    onReachBottom () {
      console.log('页面滚动到底儿了...');
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    span {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      span {
        font-size: 22rpx;
      }
    }
  }

  .tips {
    text-align: center;
    margin-top: 120rpx;
    font-size: 36rpx;
    color: #666;
  }
</style>