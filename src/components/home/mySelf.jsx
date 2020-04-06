import React, { Component } from 'react';
import { notification, Spin, Empty, Tabs, Form, List, Button, Modal, Input } from 'antd';
import { Ua } from '../../requestApi';
import { isEmpty } from '../../util/isEmpty';
import { formItemLayout } from '../../util/formStyle';
import { Format} from '../../util/DateUtil'

const { TabPane } = Tabs;

class MySelf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            passWordState: false,
            pageState: 0,//页面状态 0 为初始态  1 为非编辑 2 为编辑状态
        }
        this.data = null;
        this.editField = ['name', 'tel', 'address'];
        this.pwForm = React.createRef();
        this.form = React.createRef();
        this.buttons = (
            <div style={{ textAlign: 'right' }}>
                <Button onClick={() => this.setState({ pageState: 2 })}>修改个人信息</Button>
                <Button onClick={() => this.setState({ passWordState: true })} style={{ marginLeft: 10 }}>修改密码</Button>
            </div>
        )
    }

    componentDidMount() {
        this.initData();
    }

    //初始化用信息
    initData = async () => {
        let resultData = await Ua.queryUser();
        if (resultData && resultData.state === 'success') {
            this.data = resultData.data[0];
            this.setState({
                loading: false,
                pageState: 1
            }, () => notification.success({
                description: '查询成功！',
                message: '提示'
            }));
        } else {
            this.setState({
                loading: false
            }, () => notification.error({
                description: '查询失败！',
                message: '提示'
            }))
        }
    }

    /**
   * 获取编辑表单
   */
    getMySelfForm = () => {
        if (isEmpty(this.data)) return <Empty />
        let buttonStyle = {
            wrapperCol: {
                sm: {
                    span: 16,
                    offset: 5,
                },
            },
        };

        let initValues = {};
        let result = (<Form
            onFinish={this.saveMyself}
            ref={this.form}
            initialValues={initValues}
        >
            {
                this.editField.map(item => {
                    initValues[`${item}`] = this.data[`${item}`];
                    return (
                        <Form.Item
                            name={item}
                            label={this.getShowName(item)}
                            rule={[
                                { required: true, message: '不能为空' },
                            ]}
                            {...formItemLayout}
                            style={{ width: '50%' }}
                        >
                            <Input />
                        </Form.Item>
                    );
                })}

            <Form.Item
                {...buttonStyle}
            >
                <Button type="primary" htmlType="submit" >
                    保存
                    </Button>
                <Button style={{ marginLeft: 20 }} onClick={() => this.setState({ pageState: 1 })}>
                    取消
                </Button>
            </Form.Item>
        </Form>);
        return result;
    }


    //更新数据
    saveMyself = async (values) => {
        this.setState({
            loading: true
        })
        let newValues = { ...this.data, ...values }
        let resultData = await Ua.updateUser(newValues);
        if (resultData && resultData.state === 'success') {
            await this.initData();//重新加载一下数据
        } else {
            this.setState({
                loading: false
            }, () => notification.error({
                description: '数据更新失败！',
                message: '提示'
            }));
        }
    }

    //获取非编辑状态
    getMyself = () => {
        if (isEmpty(this.data))
            return <Empty />;
        let style = {
            margin: 2,
            padding: 2,
        };
        let resultData = [];
        //处理时间格式
        if(!isEmpty(this.data['modifyTime'])) {
            let modifyTime = Format(new Date(this.data['modifyTime']));
            this.data['modifyTime'] = modifyTime;
        }
        let createTime = Format(new Date(this.data['createTime']));
        this.data['createTime'] = createTime;
        //end
        for (let attribute of Object.keys(this.data)) {
            if (attribute === 'passWord' || attribute === 'id')
                continue;
            resultData.push(<div >
                <span style={style}> {this.getShowName(attribute)}</span>
                <span style={style}>:</span>
                <span style={style}>
                    {attribute !== 'userType' ? this.data[`${attribute}`] : this.data[`${attribute}`] === 0 ? '管理员' : '普通用户'}
                </span>
            </div>);
        }
        return (<List
            size="large"
            header={this.buttons}
            bordered
            dataSource={resultData}
            renderItem={item => <List.Item>{item}</List.Item>}
        />);

    }

    //根据id获取显示名称
    getShowName = (id) => {
        switch (id) {
            case 'loginId':
                return '登录名 ';
            case 'name':
                return '名称  ';
            case 'userType':
                return '用户类型';
            case 'code':
                return '编码';
            case 'tel':
                return '电话';
            case 'address':
                return '地址 ';
            case 'createTime':
                return '创建时间';
            case 'modifyTime':
                return '修改时间';
            default:
                return '未知字段'
        }
    }

    //修改密码确认事件
    submitPassWord = async e => {
        const values = await this.pwForm.current.validateFields();
        console.log(values)
        let resultData = await Ua.updatePassword({ newPassword: values.passWord })
        if (resultData && resultData.state === 'success') {
            this.setState({
                passWordState: false
            }, () => notification.success({
                description: '密码更新成功！',
                message: '提示'
            }))
        } else {
            this.setState({
                passWordState: false
            }, () => notification.success({
                description: '密码更新失败！',
                message: '提示'
            }))
        }
    }

    render() {
        const { loading, pageState, passWordState } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading} >
                <div style={{ padding: 20 }}>
                    <Tabs>
                        <TabPane
                            tab='个人信息'
                        >
                            {pageState === 2 ? this.getMySelfForm() : pageState === 1 ? this.getMyself() : <Empty />}
                        </TabPane>
                    </Tabs>
                    <Modal
                        visible={passWordState}
                        title='提示'
                        cancelText='取消'
                        closable
                        okText='确认'
                        onOk={this.submitPassWord}
                        onCancel={() => { this.setState({ passWordState: false }) }}
                    >
                        <Form
                            ref={this.pwForm}
                        // onFinish={this.submitPassWord}
                        >
                            <Form.Item
                                name="passWord"
                                label="密码"
                                rules={[
                                    { required: true, message: '密码不能为空' },
                                    { min: 4, message: '密码名长度不能少于4位' },
                                    { max: 20, message: '密码名不能多余20位' },
                                ]}
                                hasFeedback
                                {...formItemLayout}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="确认密码"
                                dependencies={['passWord']}
                                hasFeedback
                                {...formItemLayout}
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
                        </Form>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default MySelf;