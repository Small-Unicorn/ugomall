
export default function () {
  return new Promise((resolve, reject) => {
    mpvue.login({
      success (info) {
        resolve(info);
      }
    })
  })
}