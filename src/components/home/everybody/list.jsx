import React from 'react';
import { Spin, Modal, notification, Button, Tabs, Empty, Card, Avatar } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import sessionStorage from 'store/storages/sessionStorage';
import { Ha } from '../../../requestApi';
import { isEmpty } from '../../../util/isEmpty';
import avatar from '../../../pubic/imag/avatar.jpg';

const { TabPane } = Tabs;
const user = JSON.parse(sessionStorage.read('user'));

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
        let resultData = await Ha.queryAllMt({ taskState: '1' });
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
                            <span style={{ margin: 20 }}>{item.userName}</span>
                        </div>}
                        cover={
                            < div >
                                <div style={{ padding: 10, fontSize: 16 }}>{item.message}</div>
                                {
                                    isEmpty(item.pics) ? null : item.pics.map(e => {
                                        return (<img
                                            alt={e.title}
                                            src={e.path}
                                            style={{ margin: 20, height: 100 }}
                                        />)
                                    })
                                }
                            </div >
                        }
                        actions={
                            [
                                <span>
                                    <Button type="link" icon={<CommentOutlined />}
                                        onClick={() => {
                                            let curretnMt = JSON.stringify(item);
                                            sessionStorage.write('currentMt', curretnMt);
                                            this.props.history.push('/home/allMt/card?requireTime=' + Date.parse(new Date()))
                                        }
                                        } />
                                    42
                        </span>,
                            ]}
                    >
                    </Card>
                </div>
            )
        });
        return resultData;
    }

    render() {
        const { loading, data, deleteState } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <div style={{ padding: 20 }}>
                    <Tabs>
                        <TabPane
                            tab={"大家说"}
                        >
                            {isEmpty(data) ? <Empty /> : this.getAllMessage()}
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        );
    }
}

export default List;