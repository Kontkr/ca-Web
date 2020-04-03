import React from 'react';
import { Spin, Modal, notification, Button, Tabs, Empty, Card } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { Ha } from '../../../requestApi';
import { isEmpty } from '../../../util/isEmpty';

const { TabPane } = Tabs;

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            deleteState: false,
            data: []
        }
    }

    componentDidMount() {
        this.initData();
    }


    initData = async () => {
        this.setState({
            loading: true
        })
        let resultData = await Ha.queryAllMt();
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

    getAllMessage = () => {
        const { data } = this.state;
        let resultData = data.map(item => {
            return (
                <Card
                    style={{ width: '100%', marginBottom: 30 }}
                    size='small'
                    hoverable
                    cover={
                        <div>
                            <div style={{ marginBottom: 20, paddingLeft: 20 }}>{item.message}</div>
                            {
                                isEmpty(item.pics) ? null : item.pics.map(e => {
                                    return (<img
                                        alt={e.title}
                                        src={e.path}
                                        style={{ margin: 20, height: 200 }}
                                    />)
                                })
                            }
                        </div>
                    }
                    actions={[
                        <span>
                            <Button type="link" icon={<CommentOutlined />}
                                onClick={() => this.props.history.push('/home/allMt/card?id=' + item.id)} />
                            42
                        </span>,
                    ]}
                >
                </Card>
            )
        });
        return resultData;
    }

    render() {
        const { loading, data, deleteState } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <Tabs>
                    <TabPane
                        tab={"大家说"}
                    >
                        {isEmpty(data) ? <Empty /> : this.getAllMessage()}
                    </TabPane>
                </Tabs>
                <Modal
                    visible={deleteState}
                    title='提示'
                    cancelText='取消'
                    closable
                    okText='确认'
                    // onOk={this.deleteOkHandler}
                    onCancel={() => { this.setState({ deleteState: false }) }}
                >
                    是否刪除此条记录?
        </Modal>
            </Spin>
        );
    }
}

export default List;