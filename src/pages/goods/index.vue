<template>
  <div class="wrapper" v-if="goods">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="index" v-for="(pic, index) in goods.pics">
        <image :src="pic.pics_big"></image>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <div class="meta">
      <p class="price">￥{{goods.goods_price}}</p>
      <p class="name">{{goods.goods_name}}</p>
      <p class="shipment">快递: 免运费</p>
      <span class="collect">收藏</span>
    </div>
    <!-- 商品详情 -->
    <div class="detail">
      <!-- <rich-text :nodes="goods.goods_introduce"></rich-text> -->
      <!-- v-html 在 mpvue 下转成了 rich-text -->
      <div v-html="goods.goods_introduce"></div>
    </div>
    <!-- 操作 -->
    <div class="action">
      <button open-type="contact">联系客服</button>
      <span class="cart" @click="goCart">购物车</span>
      <span class="add" @click="addCart">加入购物车</span>
      <span class="buy">立即购买</span>
    </div>
  </div>
</template>

<script>

  // 引入 wx.request 的 Promise 封装版本
  import request from '@/utils/request';

  // 引入 延时函数
  import sleep from '@/utils/sleep';

  export default {

    data () {
      return {
        goods: null,
        // 初始购物车数据
        carts: []
      }
    },

    methods: {

      // 添加购物车
      async addCart () {

        // 标准流程，前端将商品的关键信息如 id、购买数量
        // 登录用户 id (如果登录)及型号发送到服务端

        // 如果用户未登录，一种方式是提示用户登录后再发送
        // 另外一种是直接存入本地，当用户后期登录时，再将
        // 本地的购物车数据发送到服务端

        // 本次课为了强化小程序存储 api 的使用，将上述流程
        // 简化处理了，未做任何判断，直接将购物车存入本地

        // 提取商品相关信息
        const {
          goods_id,
          goods_price,
          goods_name,
          goods_small_logo
        } = this.goods;

        // 遍历查找购物车中是否存在某商品
        let flag = false;
        this.carts.forEach((val) => {
          if(val.goods_id == goods_id) {
            // 购物车中已存在某个商品
            flag = true;
            val.goods_number += 1;

            return;
          }
        })

        // 添加购物车
        if(!flag) {
          this.carts.push({
            goods_id,
            goods_price,
            goods_name,
            goods_small_logo,
            goods_number: 1,
            goods_checked: true
          });
        }

        // 存入本地
        mpvue.setStorageSync('carts', this.carts);

        // 提示信息
        mpvue.showToast({title: '加入成功!'});

        // 停一会儿
        await sleep(2000);

        // 提示信息完成后，跳转到购物车（实际情况很少见）
        mpvue.switchTab({
          url: '/pages/cart/main'
        })
      },

      // 跳转到购物车
      goCart () {
        // 小程序中如果要跳转的页面为 配置中的 tabBar
        // 那么只能通过 wx.switchTab 实现
        mpvue.switchTab({
          url: '/pages/cart/main'
        })
      },

      // 商品详情接口
      async getGoodsDetail (id) {

        // 请求接口
        const {message} = await request({
          url: '/api/public/v1/goods/detail',
          data: {goods_id: id}
        })

        // console.log(message);
        // 数据更新
        this.goods = message;
      }
    },

    // 获取地址参数
    onLoad (query) {
      // console.log(query);

      // 调用商品详情接口
      this.getGoodsDetail(query.id);
    },

    onShow () {
      this.carts = mpvue.getStorageSync('carts') || [];
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 720rpx;
  }
  
  .meta {
    height: 270rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 30rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      // white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      display: -webkit-box;
      -webkit-line-clamp: 2; //行数
      -webkit-box-orient: vertical;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      padding-top: 50rpx;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 22rpx;
      color: #999;

      position: absolute;
      right: 20rpx;
      top: 91rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;

    span {
      display: block;
    }

    .add, .buy {
      width: 210rpx;
      text-align: center;
      line-height: 98rpx;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      line-height: 1;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
      padding-top: 56rpx;                         
    }
  }
</style>
