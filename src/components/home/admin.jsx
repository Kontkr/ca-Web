import React, { Component } from 'react';
import {
    Spin, Modal, notification, Button, Tabs, Empty, Card, Form, Input, Tooltip, Layout, Menu,
    Avatar
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    LogoutOutlined,
    UserOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { HashRouter, BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Aa, Ha, Lg } from '../../requestApi';
import { WrapButton } from '../../util/components/Wrap';
import { isEmpty } from '../../util/isEmpty';
import avatar from '../../pubic/imag/avatar.jpg'
import sessionStorage from 'store/storages/sessionStorage';

const { TabPane } = Tabs;
const { Header, Content, Sider } = Layout;


class Approval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            adoptState: false,
            rejectState: false,
        }
        this.currentMtId = null;
        this.adoptForm = React.createRef();
        this.rejectForm = React.createRef();
        this.approval = this.approval.bind(this);
    }

    componentDidMount() {
        this.initData();
    }


    //查询所有待审核的消息
    initData = async () => {
        this.setState({
            loading: true
        })
        let resultData = await Ha.queryAllMt({ taskState: '0' });
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

    //审批确认事件
    submitAdopt = async e => {
        if (isEmpty(this.currentMtId)) {
            notification.error({
                description: '操作信息Id不能为空,操作失败！',
                message: "提示",
            });
            return null;
        }
        this.setState({
            loading: true
        });
        let values = await this.adoptForm.current.validateFields();
        values['mtId'] = this.currentMtId;
        let resultData = await Aa.adopt(values);
        if (resultData && resultData.state === 'success') {
            const newData = [...this.state.data];
            let index = newData.findIndex(e => e.id === this.currentMtId);
            this.currentMtId = null;
            if (index > -1) {
                newData.splice(index, 1);
                this.setState({
                    data: newData,
                    loading: false,
                    adoptState: false,
                }, () => notification.success({
                    description: '审批成功!',
                    message: "提示",
                }));
            } else {
                notification.error({
                    description: '审批成功,但前端渲染失败!',
                    message: "提示",
                });
            }
        } else {
            notification.error({
                description: '审批失败!',
                message: "提示",
            });
        }
    }

    //驳回确认事件
    submitReject = async e => {
        let values = await this.rejectForm.current.validateFields();
        values['mtId'] = this.currentMtId;
        console.log(values);
        let resultData = await Aa.reject(values);
        if (resultData && resultData.state === 'success') {
            const newData = [...this.state.data];
            let index = newData.findIndex(e => e.id === this.currentMtId);
            this.currentMtId = null;
            if (index > -1) {
                newData.splice(index, 1);
                this.setState({
                    data: newData,
                    loading: false,
                    rejectState: false,
                }, () => notification.success({
                    description: '驳回成功!',
                    message: "提示",
                }));
            } else {
                notification.error({
                    description: '驳回成功,但前端渲染失败!',
                    message: "提示",
                });
            }
        } else {
            notification.error({
                description: '驳回失败!',
                message: "提示",
            });
        }
    }

    //获取点击的信息的Id,由 WrapButton 调用
    approval(info, _) {
        let updateState = {};
        if (info.custom === 'adpot')
            updateState['adoptState'] = true;
        else if (info.custom === 'reject')
            updateState['rejectState'] = true;
        this.setState(updateState)
        this.currentMtId = info.id;
    }

    //获取待审批列表
    getApproval = () => {
        const { data } = this.state;
        let resultData = data.map((item, index) => {
            return (
                <div>
                    {index === 0 ? null : <div style={{ height: 30, backgroundColor: '#efefef' }}></div>}
                    <Card
                        style={{ width: '100%', marginBottom: 30 }}
                        size='small'
                        hoverable
                        title={<div>
                            <Avatar
                                size='large'
                                src={avatar}
                            />
                            <span style={{ padding: 10, fontSize: 16 }}>{item.userName}</span>
                        </div>}
                        cover={
                            <div>
                                <div style={{ marginBottom: 20, paddingLeft: 20 }}>{item.message}</div>
                                {
                                    isEmpty(item.pics) ? null : item.pics.map(e => {
                                        return (<img
                                            alt={e.title}
                                            src={e.path}
                                            style={{ margin: 20, height: 100 }}
                                        />)
                                    })
                                }
                            </div>
                        }
                        actions={[
                            <WrapButton type="primary"
                                onClick={this.approval}
                                id={item.id}
                                custom='adpot'
                                name='审核'
                            />
                            ,
                            <WrapButton
                                onClick={this.approval}
                                id={item.id}
                                custom='reject'
                                name='驳回'
                            />
                            ,
                        ]}
                    >
                    </Card >
                </div>
            )
        });
        return resultData;
    }

    render() {
        const { loading, data, adoptState, rejectState } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <div style={{ padding: 20 }}>

                    <Tabs>
                        <TabPane
                            tab={"待审批"}
                        >
                            {isEmpty(data) ? <Empty /> : this.getApproval()}
                        </TabPane>
                    </Tabs>
                    <Modal
                        visible={adoptState}
                        title='审批'
                        cancelText='取消'
                        closable
                        okText='审批'
                        onOk={this.submitAdopt}
                        onCancel={() => { this.setState({ adoptState: false }) }}
                    >
                        <Form
                            ref={this.adoptForm}
                        >
                            <Form.Item
                                name='remarks'
                                rules={[
                                    { required: true, message: '请输入批语' }
                                ]}
                            >
                                <Input.TextArea placeholder='请输入批语.....' />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={rejectState}
                        title='驳回'
                        cancelText='取消'
                        closable
                        okText='驳回'
                        onOk={this.submitReject}
                        onCancel={() => { this.setState({ rejectState: false }) }}
                    >
                        <Form
                            ref={this.rejectForm}
                        >
                            <Form.Item
                                name='remarks'
                                rules={[
                                    { required: true, message: '请输入批语' }
                                ]}
                            >
                                <Input.TextArea placeholder='请输入批语.....' />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Spin>
        );
    }
}


export default class Admin extends Component {




    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            loading: false
        };
        this.user = JSON.parse(sessionStorage.read('user'));
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    //注销事件
    logout = async e => {
        let resultData = await Lg.logout();
        if (resultData && resultData.state === 'success') {
            notification.success({
                description: resultData.data,
                message: "提示",
            });
            sessionStorage.clearAll();
            this.props.history.push('/');
        } else {
            notification.error({
                description: '注销失败！',
                message: "提示",
            });
        }
    }

    render() {
        const { collapsed, loading } = this.state;
        return (
            <Layout className='admin-layout' style={{ minHeight: '100vh' }}>
                <HashRouter>
                    <Layout className='admin-content'>
                        <Sider className='admin-sider' collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                            <Menu
                                theme="light"
                                defaultSelectedKeys={['1']}
                                mode="inline"
                            >
                                <Menu.Item
                                    key='1'
                                >
                                    <Link to="/admin">
                                        <HomeOutlined />
                                        <span>审批</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            <Header style={{ backgroundColor: '#efefef', textAlign: 'right' }}>
                                <Avatar
                                    src={avatar}
                                    alt="Han Solo"
                                />
                                <span style={{ margin: '20' }}>{this.user.name}</span>
                                <Tooltip title='注销' >
                                    <Button type='link' onClick={this.logout} icon={<LogoutOutlined />} />
                                </Tooltip>
                            </Header>

                            <Content style={{ margin: '0 16px', backgroundColor: '#ffffff' }}>
                                <Switch>
                                    <Route exact path='/admin' component={Approval} />
                                </Switch>
                            </Content>
                        </Content>
                    </Layout>
                </HashRouter>
            </Layout>
        );
    }
}
