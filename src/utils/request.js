
export default function (obj) {

  // 处理默认参数
  let url = obj.url || '';
  let method = obj.method || 'get';
  let data = obj.data || {};
  let header = obj.header || {}

  // 配置基础路径
  url = 'https://www.zhengzhicheng.cn' + url;

  // var date = new Date('2019');
  // date.getFullYear();

  // var xhr = new XMLHttpRequest();
  // xhr.open();

  // 开启加载状态
  mpvue.showLoading({title: '正在加载...'});

  return new Promise((resolve, reject) => {

    // setTimeout();

    // new XMLHttpRequest();

    mpvue.request({
      url,
      method,
      data,
      header,
      success (info) {
        // 将数据传到外部（即then）
        resolve(info.data);

        // 关闭加载状态
        mpvue.hideLoading();
      },
      fail () {
        reject();
      }
    });

  });

  // return p;

  // p.then((abc) => {

  // }).catch(() => {

  // });

}