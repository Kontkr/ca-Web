import React from 'react';
import { HashRouter, BrowserRouter as Router, Route, Switch, Link, Tabs } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    HomeOutlined
} from '@ant-design/icons';
import addMt from './addMt';
import Mt from './mt';
import MySelf from './MySelf';
import AllMt from './allMt';
import './index.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


const Home = () => {
    return (<div>
        首页
    </div>);
}

export default class SiderDemo extends React.Component {
    state = {
        collapsed: false,
        loading: false
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    onClick = values => {
        console.log('触发 onClick');
    }

    onSelect = values => {
        console.log('触发 onSelect');
    }
    render() {
        const { collapsed, loading } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <Layout className='home-layout' style={{ minHeight: '100vh' }}>
                    <Header style={{ backgroundColor: '#ffffff' }}></Header>
                    <HashRouter>
                        <Layout className='home-content'>
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
                            <Content style={{ margin: '0 16px' }}>
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
                        </Layout>
                    </HashRouter>
                </Layout>
            </Spin>
        );
    }
}
