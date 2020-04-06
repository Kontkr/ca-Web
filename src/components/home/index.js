import React from 'react';
import { HashRouter, BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu, Spin, Avatar, Button, Tooltip, notification } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    LogoutOutlined,
    UserOutlined,
    HomeOutlined
} from '@ant-design/icons';
import sessionStorage from 'store/storages/sessionStorage';
import addMt from './addMt';
import Mt from './mt';
import MySelf from './MySelf';
import AllMt from './allMt';
import { Lg } from '../../requestApi'
import './index.less';
import avatar from '../../pubic/imag/avatar.jpg';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


const Home = () => {
    return (<div>
        首页
    </div>);
}
 
export default class SiderDemo extends React.Component {

    constructor(props){
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
            <Spin size="large" tip="loding" spinning={loading}>
                <HashRouter>
                    <Layout className='home-content' style={{ minHeight: '100vh' }}>
                        <Sider className='home-sider' collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                            <Menu
                                theme="light"
                                defaultSelectedKeys={['1']}
                                mode="inline"
                                onClick={this.onClick}
                                onSelect={this.onSelect}
                            >
                                <Menu.Item
                                    key='1'
                                >
                                    <Link to="/home">
                                        <HomeOutlined />
                                        <span>首页</span>
                                    </Link>
                                </Menu.Item>
                                <SubMenu
                                    key='sub2'
                                    title={
                                        <span>
                                            <UserOutlined />
                                            <span>书法</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="sub2-1">
                                        <Link to="/home/add">新建
                                            </Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub2-2">
                                        <Link to='/home/approvemt'>待审核
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub2-3">
                                        <Link to='/home/rejectmt'>不通过
                                        </Link>
                                    </Menu.Item>
                                </SubMenu>
                                <Menu.Item key="3">
                                    <Link to='/home/allmt'>
                                        <PieChartOutlined />
                                        <span>看大家</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link to='/home/user'>
                                        <DesktopOutlined />
                                        <span>个人信息</span>
                                    </Link>

                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            <Header style={{ backgroundColor: '#efefef', textAlign: 'right', }}>
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
                                    <Route exact path='/home' component={Home} />
                                    <Route path='/home/add' component={addMt} />
                                    <Route path='/home/approvemt'>
                                        <Mt taskState='0' />
                                    </Route>
                                    <Route path='/home/rejectmt'>
                                        <Mt taskState='2' />
                                    </Route>
                                    <Route path='/home/allmt' component={AllMt} />
                                    <Route path='/home/user' component={MySelf} />
                                </Switch>
                            </Content>
                        </Content>
                    </Layout>
                </HashRouter>
                {/* </Layout> */}
            </Spin >
        );
    }
}
