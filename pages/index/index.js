import React from 'react'
import { connect } from 'react-redux'

import io from 'socket.io-client';

// var fs = require('fs')

var socket = io('http://127.0.0.1:3000/')

import './index.less'
const avators = require('./images/qq1.png')

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

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            curIndex: 0,
            allGroups: [],
            msgArray: [],
            curMsg: '',
            curUserId: '',
            curRoomId: ''
        }
    }
    changeIndex = (index)=>{
        this.setState({
            curIndex: index
        })
    }

    getMsg = (e) => {
        console.log(e.target.value)
        let curMSGs = e.target.value
        this.setState({
            curMsg: curMSGs
        })
    }

    sendMsg = () => {
        if(!this.state.curMsg) {
            alert('输入内容不能为空')
            return
        }
        // alert(this.state.curMsg)
        socket.emit('sendMsg', {
            msg:{
                nick: this.state.curUserId,
                msg: this.state.curMsg,
                isSelf: true
            },
            curUserId: this.state.curUserId,
            curRoomId: this.state.curRoomId
        })
    }

    componentWillMount() {
        socket.on('hello', (data) => {
            console.log(data,'hello')
            this.setState({
                allGroups: data.allGroups,
                msgArray: data.msgArray,
                curUserId: data.curUserId,
                curRoomId: data.curRoomId
            })
        })

        socket.on('msg', (data) => {
            console.log(data, 'msg')
            let newmsgArray = this.state.msgArray
            // debugger
            if (this.state.curUserId == data.curUserId) {
                data.msg.isSelf = true
            } else {
                data.msg.isSelf = false
            }
            newmsgArray.push(data.msg)
            this.setState({
                msgArray: newmsgArray,
                curMsg: ''
            })
        })
    }

    render() {
        var baseIndex = 0
        return (
            <div>
                <div className="main">
                    <div className="header">
                        <div className="header-left flex-y">
                            <div className="dots">
                                <ul>
                                    <li className="li li1"></li>
                                    <li className="li li2"></li>
                                    <li className="li li3"></li>
                                </ul>
                            </div>
    
                            <div className="search"></div>
                        </div>
    
                        <div className="header-right flex-y">
                            <img src={avators} className="header-img" />
                            <div className="header-close"></div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="slide">
                            <ul>
                                {
                                    this.state.allGroups.map((item, index)=>{
                                        // alert(this.curIndex)
                                        return(
                                            <li className={index == this.state.curIndex? 'lis lis-active flex-y' : 'lis flex-y'} key={index} 
                                                onClick={ ()=>{ this.changeIndex(index) } }>
                                                <div className="avator">
                                                    <img src={avators} className="avator-img" />
                                                </div>
                                                <div className="lis-right">
                                                    <div className="title">{item.groupName}</div>
                                                    <div className="desc">{item.des}</div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
    
                        <div className="chatting">
                            <div className="chatting-content">
                                <div className="chatting-box">
                                    <ul>
                                        {
                                            this.state.msgArray.map( (item, index) =>{
                                                return (
                                                    <li className={!item.isSelf ? 'msg flex-y' : 'my-msg'} key={index}>
                                                        <img src={avators} className="avators" />
                                                        <div className="info">
                                                            <p className="nick">{item.nick}</p>
                                                            <div className="cur-msg">{item.msg}</div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="chattingi-input">
                                <textarea  className="chattingi-input-all" value={this.state.curMsg} onChange={this.getMsg}/>
                                <div className="chattingi-input-btn" onClick={this.sendMsg}>发送</div>
                            </div>
                        </div>
    
                        <div className="numbers">
                            <div className="gonggao">
                                <p className="title">本群须知:</p>
                                <p className="content">
                                    少灌水，多读书多交流，推荐每日拍照打卡~￼
                                    少灌水，多读书多交流，推荐每日拍照打卡~￼
                                    少灌水，多读书多交流，推荐每日拍照打卡~￼
                                    少灌水，多读书多交流，推荐每日拍照打卡~￼
                                </p>
                            </div>
                            <div className="allNumber">
                                <div className="curNumbers">成员 203/303</div>
                                <ul>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">老村长</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">老船长</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">Jerry && Tom</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">@fouse</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">亮晶晶</div>
                                    </li><li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">老村长</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">老船长</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">Jerry && Tom</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">@fouse</div>
                                    </li>
                                    <li className="lis flex-y">
                                        <img src={avators}  className="avator-img" />
                                        <div className="avator-nick">亮晶晶</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    console.log(state, 'mapStateToProps')
    return { state }
}

const mapDispatchToProps  = (dispatch) => {
    return {
        changeName() {
            dispatch({
                type: "CHANGE_NAME",
                card: {
                    name: 'xxx---changing',
                    avator: 'b.jpg---changing'
                },
                dialog: {
                    status:  true
                }
            })
        },
        showDialog() {
            dispatch({
                type: 'SHOW_DIALOG',
                dialog: {
                    status:  true
                }
            })
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Index)