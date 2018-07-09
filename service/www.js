const koa =  require('koa2')
const http = require('http');
const https = require('https');

const socket = require('socket.io')
const fs = require('fs')

const app = new koa()
app.use(async ctx => {
    ctx.body = 'hello, worldx'
})

const server  = http.createServer(app.callback()).listen(3000)
// app.listen(3000)

const io = socket(server)

//设置当前用户id
let curUserId = 1;

//设置当前 房间 id
let curRoomId = 0+''

// 当前群的 对话消息列表
let msgArray = [
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
let allGroups = [
    {
        groupName: '众安深圳屌丝群...',
        des: '村长：你是真的皮'
    },
    {
        groupName: '中洲小分队..',
        des: '船长：jio抬一下。。。'
    },
    {
        groupName: '杏仁派前置开发群...',
        des: 'focus：华哥快发红包...'
    },
    {
        groupName: '沉迷加班(InsWelfare)',
        des: '才哥：我是真球迷，你们都是伪球迷...'
    },
    {
        groupName: '众安深圳屌丝群...',
        des: '村长：你是真的皮'
    },
    {
        groupName: '沉迷加班(InsWelfare)',
        des: '一只粉刷匠：绝交，死胖子'
    },
]

// 当前所有用户列表
let allUers = {}

// 当前所有房间
let allRooms = {}

// 监听 socket 连接
io.on('connection', function(socket) {
    // 进入默认房间
    // socket.join(curRoomId)

    // 触发 hello 事件
    // io.to(curRoomId).emit('hello', {
    //     curRoomId,
    //     curUserId,
    //     allGroups,
    //     msgArray
    // })
    console.log(socket.id)
    allUers.curUserId = socket.id
    // curUserId = socket.id

    socket.emit('hello', {
        curRoomId,
        curUserId: socket.id,
        allGroups,
        msgArray
    })

    

    socket.on('sendMsg', (data) => {
        console.log(data)
        io.emit('msg',data)
        // socket.broadcast.to(data.curRoomId).emit('msg',data.msg)
        // io.emit('msg',data)
    })
    

    
})
