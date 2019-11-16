<template>
  <div class="wrapper">
    <block v-if="carts.length">
      <!-- 收货信息 -->
      <dl class="shipment">
        <block v-if="address">
          <dt>收货人: </dt>
          <dd class="meta">
            <span class="name">{{address.userName}}</span>
            <span class="phone">{{address.telNumber}}</span>
          </dd>
          <dt>收货地址:</dt>
          <dd>{{detailAddress}}</dd>
        </block>
        <button v-else @click="getAddress" type="primary">收货地址</button>
      </dl>
      <!-- 购物车 -->
      <div class="carts">
        <div class="item">
          <!-- 店铺名称 -->
          <div class="shopname">优购商城</div>
          <div class="goods" :key="goods.goods_id" v-for="(goods, index) in carts">
            <!-- 商品图片 -->
            <image class="pic" :src="goods.goods_small_logo"></image>
            <!-- 商品信息 -->
            <div class="meta">
              <p class="name">{{goods.goods_name}}</p>
              <p class="price"><span>￥</span>{{goods.goods_price}}<span>.00</span></p>
              <!-- 加减 -->
              <div class="amount">
                <span class="reduce" @click="changeNumber(-1, index)">-</span>
                <input type="number" :value="goods.goods_number" class="number">
                <span class="plus" @click="changeNumber(1, index)">+</span>
              </div>
            </div>
            <!-- 选框 -->
            <span class="checkbox" @click="toggle(index)">
              <icon type="success" size="20" :color="goods.goods_checked ? '#ea4451' : '#ccc'"></icon>
            </span>
          </div>
        </div>
      </div>
      <!-- 其它 -->
      <div class="extra">
        <label class="checkall" @click="checkAll">
          <icon type="success" :color="carts.length == checkedGoods.length ? '#ea4451' : '#ccc'" size="20"></icon>
          全选
        </label>
        <div class="total">
          合计: <span>￥</span><label>{{amount}}</label><span>.00</span>
        </div>
        <div class="pay" @click="pay">结算({{checkedGoods.length}})</div>
      </div>
    </block>
    <block v-else>
      <div class="tips">空空如也~</div>
    </block>
  </div>
</template>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(https://ugo2.oss-cn-hangzhou.aliyuncs.com/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    span.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .item {
      margin-top: 20rpx;
    }
    
    .shopname {
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      span.checkbox {
        display: block;
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

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

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        span {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, span {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      span {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }

  .tips {
    text-align: center;
    font-size: 40rpx;
    color: #666;
    margin-top: 200rpx;
  }
</style>

<script>

  import request from '@/utils/request';

  // lodash 是一个js库，封装许多实用的工具方法
  import _ from 'lodash';

  // lodash 没有针对小程序做优化，需要处理一下
  // 见 http://blog.dongsj.cn/20180827-lodash-in-miniprogram.html

  export default {
    
    data () {
      return {
        // 收货地址
        address: null,
        // 购物车
        carts: mpvue.getStorageSync('carts') || []
      }
    },

    computed: {
      detailAddress () {
        // 拼凑的完整地址
        return this.address && (this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo);
      },

      // 将整个购物中的商品选中状态为 true 的提取出来
      checkedGoods () {
        return this.carts.filter((val) => {
          return val.goods_checked;
        })
      },

      amount () {
        let total = 0;
        this.checkedGoods.forEach((val) => {
          total += val.goods_number * val.goods_price;
        })

        return total;
      }
    },

    methods: {

      // 创建订单，然后结算
      async pay () {
        // 检测是否登录（本地是否有 token）
        if(!mpvue.getStorageSync('token')) {
          return mpvue.navigateTo({url: '/pages/auth/main'});
        }

        // 用户是否填写收货地址
        if(!this.detailAddress) {
          return mpvue.showToast({title: '收货地址必填!'});
        }

        // 用户是否选中商品
        if(!this.checkedGoods.length) {
          return mpvue.showToast({title: '至少买一件'});
        }

        // 完成结算操作
        const {message, meta} = await request({
          url: '/api/public/v1/my/orders/create',
          method: 'post',
          // 登录令牌
          header: {Authorization: mpvue.getStorageSync('token')},
          data: {
            order_price: this.amount,
            consignee_addr: this.detailAddress,
            goods: this.checkedGoods
          }
        })

        // 将已经结算的商品从购物车中移除
        this.carts = _.differenceWith(this.carts, this.checkedGoods, _.isEqual);

        // console.log(this.carts);
        
        // 重新存在本地
        mpvue.setStorageSync('carts', this.carts);

        // 创建订单成功
        if(meta.status == 200) return mpvue.navigateTo({url: '/pages/order/main'});
      },

      // 选中所有商品
      checkAll () {
        this.carts.forEach((val) => {
          val.goods_checked = true;
        })
      },

      // 切换购物车中商品的选中状态
      toggle (index) {
        this.carts[index].goods_checked = !this.carts[index].goods_checked;
      },

      // 修改商品的数量
      changeNumber (step, index) {

        // 最少购买一件
        if(step == -1 && this.carts[index].goods_number <= 1) {
          return mpvue.showToast({title: '至少买一件'});
        }

        // 最多不能超过库存
        if(step == 1 && this.carts[index].goods_number >= 10) {
          return mpvue.showToast({title: '不能超过库存'});
        }

        // 对索引值为 index 的商品 增减数量
        this.carts[index].goods_number += step;
      },

      // 通过小程序提供的 api 获得用户的收货地址
      getAddress () {
        mpvue.chooseAddress({
          success: (info) => {
            // console.log(info);
            this.address = info;
          }
        });
      }
    },

    onShow () {
      // 实时获取本地存储的数据
      this.carts = mpvue.getStorageSync('carts') || [];
    }
  }
</script>