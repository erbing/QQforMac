export default  {
    getParam: function(name) {
        const reg =  new RegExp("(^|&)"+ 'id' +"=([^&]*)(&|$)")
        const urlArr = window.location.search.substr(1).match(reg)
        return urlArr[2]
    }
}