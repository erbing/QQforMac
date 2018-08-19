import React from 'react'
import { connect } from 'react-redux'
// 引用 antd 组件
// import { Modal, Button } from 'antd'
// import 'antd/dist/antd.less';

// 引用 material ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import io from 'socket.io-client';
import params from '../utils/getParams'


var socket = io('http://127.0.0.1:3000/')

import './index.less'
const avators = require('./images/qq1.png')



let allGroups = []  // 群组

let curRoomId = params.getParam('id')   // 获取当前房间号


class Index extends React.Component {
    // constructor() {
    //     super();
    //     this.state = {
    //         curIndex: 0,    
    //         allGroups: [],      // 所有的群组
    //         msgArray: [],       // 当前群组内的  消息列表
    //         curMsg: '',         // 当前消息
    //         curUserId: {},      // 当前用户的 id
    //         curRoomId: ''       // 当前房间号
    //     }
    // }
    state = {
        curIndex: 0,    
        allGroups: [],      // 所有的群组
        msgArray: [],       // 当前群组内的  消息列表
        curMsg: '',         // 当前消息
        curUserId: {},      // 当前用户的 id
        curRoomId: '',       // 当前房间号
        open: true,      // 进来的时候 填写姓名的 弹框
        fullScreen: false
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    
    handleClose = () => {
        this.setState({ open: false });
    }

    changeIndex = (index)=>{
        this.setState({
            curIndex: index
        })
    }

    getMsg = (e) => {
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
            curUserId: sessionStorage.getItem('QQ_SOCKET_ID'),
            curRoomId: this.state.curRoomId
        })
    }

    componentWillMount() {
        let QQ_SOCKET_ID = sessionStorage.getItem('QQ_SOCKET_ID')
        socket.on('hello', (data) => {
            console.log(data,'hello')
            this.setState({
                allGroups: data.allGroups,
                msgArray: data.msgArray,
                curUserId: QQ_SOCKET_ID  ? QQ_SOCKET_ID  : data.id,
                curRoomId: data.curRoomId
            })
            if(!QQ_SOCKET_ID ) {
                sessionStorage.setItem('QQ_SOCKET_ID', data.id)
            }
        })

        socket.on('msg', (data) => {
            console.log(data, 'msg')
            let newmsgArray = this.state.msgArray
            // debugger
            if (QQ_SOCKET_ID == data.curUserId) {
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
                    {/* <Button variant="contained" color="primary"> </Button> */}
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        >
                        <DialogTitle id="form-dialog-title">请输入您的昵称</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            昵称就是网名的意思，你还记得你的第一个网名么？
                            </DialogContentText>
                            <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="正在输入中..."
                            type="email"
                            fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                            Cancel
                            </Button>
                            <Button onClick={this.handleClose} color="primary">
                            Subscribe
                            </Button>
                        </DialogActions>
                    </Dialog>
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