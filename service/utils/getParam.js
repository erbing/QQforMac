export default  {
    getParam: function(url, name) {
        const reg =  new RegExp("(^|&)"+ 'id' +"=([^&]*)(&|$)")
        const urlArr = url.substr(1).match(reg)
        return urlArr[2]
    }
}