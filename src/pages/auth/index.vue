<template>
  
  <div>
    <button type="primary" @getuserinfo="getUserInfo" open-type="getUserInfo">微信登录</button>
  </div>

</template>

<script>

  // 导入 api 的 Promise 封装
  import getUserInfo from '@/utils/getuserinfo';
  import getSetting from '@/utils/getsetting';
  import request from '@/utils/request';
  import login from '@/utils/login';

  export default {

    methods: {
      getUserInfo (ev) {
        // console.log(ev);

        // 获得用户信息
        const {
          encryptedData,
          rawData,
          iv,
          signature
        } = ev.target;

        // 调用登录接口
        this.login(encryptedData, rawData, iv, signature);
      },

      async login (encryptedData, rawData, iv, signature) {

        // 调用 wx.login 获取登录凭证
        const {code} = await login();

        // 请求登录接口
        const {message} = await request({
          url: '/api/public/v1/users/wxlogin',
          method: 'post',
          data: {
            code,
            encryptedData,
            rawData,
            iv,
            signature
          }
        });

        // console.log(message);
        // 将登录状态(token)记录在本地
        mpvue.setStorageSync('token', message.token);
        // 返加上一步，继续操作
        mpvue.navigateBack({delta: 1});
      }
    },

    async onLoad () {

      // 1. 检测是否授权
      const {authSetting} = await getSetting();
      
      if(authSetting['scope.userInfo']) {

        // 获得用户信息
        const {
          encryptedData,
          rawData,
          iv,
          signature
        } = await getUserInfo();

        // 调用登录接口
        this.login(encryptedData, rawData, iv, signature);
      }

      // 小程序提供了专门的 api 获取当前微信用户的信息
      // mpvue.getUserInfo({
      //   success (info) {
      //     console.log(info);
      //   }
      // });

      // 小程序中中的 button 可以调起授权窗口

      // 当通过按钮获取用户授权时，会触发一个事件 getuserinfo

      // 并能获取用户信息

      // 通过 getSetting 检测是否授权
      // mpvue.getSetting({
      //   success (info) {
      //     console.log(info)
      //   }
      // })
    }
  }
</script>

<style lang="less">
  button {
    width: 640rpx;
    margin: 200rpx auto;
  }
</style>