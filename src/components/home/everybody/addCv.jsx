import React, { Component } from 'react';
import { Modal, Form, Rate, Input } from 'antd';

class AddCv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentState: false
        }

        this.form = React.createRef();
        this.showModal = this.showModal.bind(this);
    }

    //留给父组件调用
    showModal() {
        this.setState({
            commentState: true,
        })
    }


    //提交评论
    submitCv = async e => {
        let values = await this.form.current.validateFields();
        this.setState({
            commentState: false
        });
        //清空form
        this.form.current.resetFields();
        this.props.submitCv(values);
    }

    render() {
        return (
            <Modal
                visible={commentState}
                title='评论'
                cancelText='取消'
                closable
                okText='确认'
                onOk={this.submitCv}
                onCancel={() => { this.setState({ commentState: false }) }}
            >
                <Form>
                    <Form.Item
                        name='start'
                        label='评分'
                        initialValues={{ start: 3.5 }}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        lable='评论'
                        name='comment'
                        rules={[
                            { required: true, message: '不能为空！' },]}
                    >
                        <Input.TextArea placeholder='期待你的神评论...' />
                    </Form.Item>

                </Form>
            </Modal>
        );
    }
}

export default AddCv;