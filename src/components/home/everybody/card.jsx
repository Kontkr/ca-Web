import React from 'react';
import { Spin, Modal, notification, Button, Tabs, Empty, Card, Rate, Input } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { Ha } from '../../../requestApi';
import { isEmpty } from '../../../util/isEmpty';
import sessionStorage from 'store/storages/sessionStorage';
import AddCv from './addCv';

const { TabPane } = Tabs;

class McCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            Cvs: [],//评论数据
            commentState: false
        }
        //stage 中读取
        this.MtData = null;
        //信息id
        this.id = null;
    }

    componentDidMount() {
        this.initMt();
        this.initCvs();
    }

    //初始化信息
    initMt = () => {
        let MtData = JSON.parse(sessionStorage.read('currentMt'));
        this.MtData = MtData;
        this.id = MtData.id;
    }

    // 初始评论
    initCvs = async () => {
        this.setState({
            loading: true
        })
        let resultData = await Ha.queryMC({ mtId: this.id });
        if (resultData && resultData.state === 'success') {
            this.setState({
                Cvs: resultData.data,
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

    submitCv = async values => {
        const { Cvs } = this.state;
        let resultData = await Ha.addComment(values);
        if (resultData && resultData.state === 'success') {
            await this.initCvs();//重新查询评论
        } else {
            notification.error({
                description: '评论失败,请在试试！',
                message: "提示",
            });
        }
    }

    //拼接 Mt jsx
    getMt = () => {
        const mtData = this.MtData;
        return (
            <div>
                <Card
                    style={{ width: '100%', marginBottom: 30 }}
                    size='small'
                    hoverable
                    cover={
                        <div>
                            <p style={{ margin: 20 }}>{mtData.message}</p>
                            {
                                isEmpty(mtData.pics) ? null : mtData.pics.map(e => {
                                    return (<img
                                        alt={e.title}
                                        src={e.path}
                                        style={{ margin: 20, height: 200 }}
                                    />)
                                })
                            }
                        </div>
                    }
                >
                </Card>
            </div >
        )
    }

    //拼接 Cvs
    getCvs = () => {
        const { Cvs } = this.state;
        if (isEmpty(Cvs)) return <Empty />
        let resultData = Cvs.map(e => (
            <div>
                <Comment
                    actions={actions}
                    author={<a>e.userName</a>}
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <div>
                            <div>
                                <Rate disabled defaultValue={e.start} />
                                <span>{commenTime}</span>
                            </div>
                            <p>
                                {e.comment}
                            </p>
                        </div>
                    }
                // datetime={
                //     <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                //         <span>{moment().fromNow()}</span>
                //     </Tooltip>
                // }
                />
            </div>
        ));
        return resultData;
    }


    render() {
        const { loading, Cvs } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <Tabs>
                    <TabPane
                        tab={"详细"}
                    >
                        {isEmpty(data) ? <Empty /> : this.getMc()}
                    </TabPane>
                    <TabPane
                        tab='评论区'
                    >
                        <div>
                            <Button type="link"
                                onClick={() => this.setState({ commentState: true })}
                            >
                                <div>
                                    <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                        alt="Han Solo"
                                    />
                                    <Input placeholder='我也来说一句' style={{ marginRight: 30 }} />
                                    <CommentOutlined />
                                </div>
                            </Button>
                        </div>
                    </TabPane>
                </Tabs>
                <AddCv ref={this.addForm} submitCv={this.submitCv} />
            </Spin>
        );
    }
}

export default McCard;