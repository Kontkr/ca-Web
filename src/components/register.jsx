import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Spin,
    Layout, notification,Result
} from 'antd';
import { Ua } from '../requestApi';

const { Header, Content } = Layout;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const RegistrationForm = () => {
    const [form] = Form.useForm();
    const [loading, setloading] = useState(false);
    const [pageStae, setPageSate] = useState(true);
    //注册
    const onFinish = async values => {
        setloading(true);
        let resultData = await Ua.register(values);
        if (resultData || resultData.state === 'success') {
            form.resetFields();//清空数据
            setPageSate(false);
        } else {
            notification.error({
                description: '注册失败！',
                message: "提示",
            })
        }
        setloading(false);
    };

    //清空数据
    const clearForm = () => {
        form.resetFields();
    }

    return (
        <Spin size="large" tip="loding" spinning={loading}>
            <Layout className="register-layout">
                <Header className='register-header'>
                </Header>
                <Content className='register-content'>
                    {
                        pageStae ?
                            (<Form
                                {...formItemLayout}
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                scrollToFirstError
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
                                    name="name"
                                    label='用户名'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入用户名!',
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="passWord"
                                    label="密码"
                                    rules={[
                                        { required: true, message: '密码不能为空' },
                                        { min: 4, message: '密码名长度不能少于4位' },
                                        { max: 20, message: '密码名不能多余20位' },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label="确认密码"
                                    dependencies={['passWord']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: '请再次输入密码!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('passWord') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject('两次输入的密码不一致!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="tel"
                                    label="电话"
                                    rules={[
                                        {
                                            // len:12 ,
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label='地址'
                                    name='address'
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        注册
                            </Button>
                                    <Button style={{ marginLeft: '20%' }} onClick={clearForm}>
                                        清空
                         </Button>
                                </Form.Item>
                            </Form>) : (<Result
                                status='success'
                                title='注册成功！'
                                extra={[
                                    <Button type="primary" onClick={() => this.props.history.push('/')}>
                                        登录
                                     </Button>,
                                    <Button onClick={() => setPageSate(true)}>继续注册</Button>,
                                ]}
                            />
                            )}
                </Content>
            </Layout>
        </Spin>
    );
};

export default RegistrationForm;
