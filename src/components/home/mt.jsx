import React, { Component } from 'react';
import { Ha } from '../../requestApi';
import { isEmpty } from '../../util/isEmpty';
import { notification, Spin, Empty, Tabs, Card, Tooltip, Modal, Avatar } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { WrapButton } from '../../util/components/Wrap';
import avatar from '../../pubic/imag/avatar.jpg';

/**
 * 查看审核中与审核不通过的数据
 */

const { TabPane } = Tabs;

export default class Mt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            deleteState: false
        }
        this.deleteMt = this.deleteMt.bind(this);
        this.currentDeleteMtId = null;
        this.originState = null;
    }

    componentDidMount() {
        this.originState = this.props.taskState;
        console.log('componentDidMount')
        // this.initData();
    }

    initData = async () => {
        this.setState({
            loading: true
        })
        let taskState = this.props.taskState;
        console.log('taskState:' + taskState);
        let resultData = await Ha.queryMyMt({ taskState });
        if (resultData && resultData.state === 'success') {
            this.setState({
                data: resultData.data,
                loading: false
            }, () => notification.success({
                description: '查询成功！',
                message: "提示",
            }));
        } else {
            notification.error({
                description: '查询失败！',
                message: "提示",
            });
            this.setState({
                loading: false
            })
        }

    }

    //刪除mt
    deleteMt(props, _) {
        this.currentDeleteMtId = props.id;
        this.setState({
            deleteState: true,
        })
    }

    //清除确认事件
    deleteOkHandler = async e => {
        if (isEmpty(this.currentDeleteMtId)) {
            this.setState({
                deleteState: false
            }, () => notification.error({
                description: '刪除的消息id不能空！',
                title: '提示'
            }));
            return null;
        }
        const { data } = this.state;
        const newData = [...data];
        let resultData = await Ha.deleteMyMt({ mtId: this.currentDeleteMtId });
        if (resultData && resultData.state === 'success') {
            let index = newData.findIndex(e => e.id === this.currentDeleteMtId);
            if (index > -1) {
                newData.splice(index, 1);
                this.setState({
                    data: newData,
                    deleteState: false
                }, () => notification.success({
                    description: '刪除成功！',
                    title: '提示'
                }));
                this.currentDeleteMtId = null;
            }
        } else {
            this.setState({
                deleteState: false
            }, () => notification.error({
                description: '刪除失败！',
                title: '提示'
            }));
        }
    }

    //刪除的取消事件
    deleteOnHandler = e => {
        this.currentDeleteMtId = null;
        this.setState({
            deleteState: false,
        });
    }

    getMt = () => {
        const { data } = this.state;
        let resultData = data.map((item, index) => {
            return (
                <div>
                    {index === 0 ? null : <div style={{ height: 30, backgroundColor: '#efefef' }}></div>}
                    <Card
                        style={{ width: '100%', height: '100%' }}
                        size='small'
                        hoverable
                        extra={(
                            <Tooltip title='刪除' >
                                <WrapButton id={item.id} onClick={this.deleteMt} icon={<DeleteOutlined />} />
                            </Tooltip>)}
                        title={<div>
                            <Avatar
                                size='large'
                                src={avatar}
                            />
                            <span style={{ margin: 20 }}>{item.userName}</span>
                        </div>}
                        cover={
                            <div>
                                <div style={{ padding: 10, fontSize: 16 }}>{item.message}</div>
                                {
                                    isEmpty(item.pics) ? null : item.pics.map(e => {
                                        return (<img
                                            alt={e.title}
                                            src={e.path}
                                            style={{ margin: 20, height: 150 }}
                                        />)
                                    })
                                }
                            </div>
                        }
                    >
                    </Card>
                    {/* 站位 */}

                </div>
            )
        });
        return resultData;
    }

    compare = () => {
        if (this.originState !== this.props.taskState) {
            this.originState = this.props.taskState;
            this.initData();
        }
    }

    render() {
        const { data, loading, deleteState } = this.state;
        let message = this.props.taskState === '0' ? '待审批' : '不通过';
        this.compare();
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <div style={{ padding: 20 }}>
                    <Tabs>
                        <TabPane
                            tab={message}
                        >
                            <div styel={{ height: 200, overflow: 'auto' }}>
                                {isEmpty(data) ? <Empty /> : this.getMt()}
                            </div>
                        </TabPane>
                    </Tabs>
                    <Modal
                        visible={deleteState}
                        title='提示'
                        cancelText='取消'
                        closable
                        okText='确认'
                        onOk={this.deleteOkHandler}
                        onCancel={() => { this.setState({ deleteState: false }) }}
                    >
                        是否刪除此条{message}的记录?
            </Modal>
                </div>
            </Spin>
        )
    }

}
