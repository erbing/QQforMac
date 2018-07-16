const koa =  require('koa2')
const http = require('http');
const https = require('https');

const socket = require('socket.io')
const fs = require('fs')

const getParam = function(url) {
    var resUrl = url.substr(url.indexOf('id')).split('=')[1]
    // console.log(url,'xx')
    return resUrl
}

const app = new koa()
app.use(async ctx => {
    ctx.body = 'hello, worldx'
})

const server  = http.createServer(app.callback()).listen(3000)
// app.listen(3000)

const io = socket(server)

//设置当前用户id
var curUserId = 1;

//设置当前 房间 id
var curRoomId = 0+''

// 当前群的 对话消息列表
var msgArray = [
    {
        nick: '老村长',
        msg: '哈哈哈哈哈哈哈哈哈',
        isSelf: false
    },
    {
        nick: '老船长',
        msg: '白天不懂夜的黑hahahhaha',
        isSelf: false
    },
    {
        nick: 'focus',
        msg: '白天不懂黑的亮晶晶heiheiheihei',
        isSelf: false
    },
    {
        nick: 'zigzag',
        msg: '今日，我还是西楚霸王',
        isSelf: true
    },
]

// 当前所有群列表
var allGroups = [
    {
        groupName: 'VueJS 中文社区群',
        des: '村长：你是真的皮'
    },
    {
        groupName: 'ReactJS 中文社区群',
        des: '船长：jio抬一下。。。'
    },
    {
        groupName: 'AngularJS 中文社区群',
        des: 'focus：华哥快发红包...'
    },
    {
        groupName: '前端基础技术群',
        des: '才哥：我是真球迷'
    },
    {
        groupName: 'html5 技术群',
        des: '村长：你是真的皮'
    },
    {
        groupName: 'CSS3 技术群',
        des: '一只粉刷匠'
    },
]

// 当前所有用户列表
var allUers = {}

// 当前所有房间
var allRooms = {}

// 当前用户信息
var curUser = {}

// 监听 socket 连接
io.on('connection', function(socket) {
    curRoomId = getParam(socket.handshake.headers.referer)

    

    curUser.id = socket.id
    curUser.curRoomId = curRoomId
    curUser.allGroups = allGroups
    curUser.msgArray = msgArray

    allUers[socket.id] = curUser
    //allUers[socket.id].curUserId = socket.id
    

    // 进入默认房间
    socket.join(curRoomId)
    // 触发 hello 事件
    io.to(curRoomId).emit('hello', curUser)
    console.log(socket.id + '加入房间' + curRoomId)
    
    // curUserId = socket.id

    // socket.emit('hello', {
    //     curRoomId,
    //     curUserId: socket.id,
    //     allGroups,
    //     msgArray
    // })

    

    socket.on('sendMsg', (data) => {
        console.log(data)
        io.to(data.curRoomId).emit('msg',data)
    })
    

    
})
