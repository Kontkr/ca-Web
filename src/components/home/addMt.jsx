import React from 'react';

import { Upload, Modal, Input, Form, Button, Result, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

/**
 * 新增消息
 */

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      pageState: true,// true 新建  false 发布成功
      fileList: []
    }
    this.form = React.createRef();
  };

  componentDidMount() {
    console.log('进入componentDidMount')
  }

  componentWillMount() {
    console.log('componentWillMount')
  }
  handleCancel = () => this.setState({ previewVisible: false });

  //预览图片
  handlePreview = async file => {
    if (!file.url && !file.preview) {//针对于url与preview的都为空的情况
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  //提交任务
  submitTask = async (values) => {
    const { fileList } = this.state;
    let param = new FormData();
    param.append('message', values.message);
    fileList.forEach(item => {
      param.append('files', item.originFileObj);
    });
    axios({
      method: 'post',
      url: '/mplan/ca/mt/addmessage',
      data: param,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      let resultData = response.data;
      if (resultData && resultData.state === 'success') {
        this.setState({
          pageState: false,
        });
      } else {
        notification.error({
          description: '发布失败,请刷新重试！',
          message: '提示'
        })
      }
    }).catch(error =>
      notification.error({
        description: '发布失败,请刷新重试！',
        message: '提示'
      })
    )
  }

  customRequest = file => {
    console.log(file)
  }

  beforeUpload = file => {
    console.log(file)
    return false;
  }

  clearAdd = () => {
    this.setState({
      pageState: true,
      previewVisible: false,
      previewImage: '',
      fileList: []
    });
  }

  render() {
    const { previewVisible, previewImage, fileList, pageState } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        {pageState ?
          (
            <div style={{padding:20}}><Form
              ref={this.form}
              onFinish={this.submitTask}
            >
              <Form.Item
                name='message'
                rules={[
                  { required: true, message: '不能为空！' },]}
              >
                <Input.TextArea placeholder='说点什么吧...' />
              </Form.Item>

              <Form.Item>
                <div className="clearfix">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}//预览文件
                    onChange={this.handleChange}
                    // customRequest={this.customRequest}
                    beforeUpload={this.beforeUpload}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
            </Button>
              </Form.Item>
            </Form></div>) : (<Result
              status="success"
              title='发布成功！'
              extra={[
                <Button type="primary" onClick={() => this.props.history.push('/home')}>
                  返回首页
              </Button>,
                <Button onClick={this.clearAdd}>继续发布</Button>,
              ]}
            />
          )}
      </div>
    );
  }
}
