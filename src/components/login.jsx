import React, { Component } from 'react';
import { Layout, Spin, Form, Input, Button, notification } from 'antd';
import sessionStorage from 'store/storages/sessionStorage';
import './index.less';
import { Lg } from '../requestApi';
import desk from '../pubic/imag/avatar.jpg';

const { Header, Content } = Layout;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    //登录
    onSubmit = async (values) => {
        let resultData = await Lg.login(values);
        if (resultData && resultData.state === 'success') {
            let user = resultData.data;
            sessionStorage.write('user', JSON.stringify(user));
            if (user.userType === 0)
                this.props.history.replace('/admin');
            else if (user.userType === 1)
                this.props.history.replace('/home');
            else
                notification.error({
                    description: '用户类型错误！',
                    message: "提示",
                })
        } else {
            notification.error({
                description: resultData.data,
                message: "提示",
            })
        }
    }

    //注册
    register = () => {
        this.props.history.push('/register');
    }

    render() {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        const { loading } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <Layout className="login-layout" >
                    {/* <Header className='login-header'>
                    </Header> */}
                    <Content className='login-content'>
                        <Form
                            {...layout}
                            name="basic"
                            onFinish={this.onSubmit}
                            className='login-form'
                        // onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="登录名"
                                name="loginId"
                                rules={[
                                    { required: true, message: '请输入用户名!' },
                                    { min: 4, message: '用户名长度不能少于4位' },
                                    { max: 20, message: '用户名不能多余20位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由数字英文字母或下划线组成' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="passWord"
                                rules={[
                                    { required: true, message: '密码不能为空' },
                                    { min: 4, message: '密码名长度不能少于4位' },
                                    { max: 20, message: '密码名不能多余20位' },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button className='login-form-login' type="primary" htmlType="submit">
                                    登录
                                </Button>
                                <Button className='login-form-register' onClick={this.register} >
                                    注册
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
            </Spin>
        );
    }
}

export default Login;