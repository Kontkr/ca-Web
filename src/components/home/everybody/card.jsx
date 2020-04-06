import React from 'react';
import { Spin, Modal, notification, Button, Tabs, Empty, Card, Rate, Input, Avatar, Tooltip } from 'antd';
import { CommentOutlined, DeleteOutlined } from '@ant-design/icons';
import sessionStorage from 'store/storages/sessionStorage';
import { Ha } from '../../../requestApi';
import { isEmpty } from '../../../util/isEmpty';
import AddCv from './addCv';
import avatar from '../../../pubic/imag/avatar.jpg';
import { Comment } from 'antd';
import { Format } from '../../../util/DateUtil';
import { WrapButton } from '../../../util/components/Wrap';

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
        this.addForm = React.createRef();
        this.user = JSON.parse(sessionStorage.read('user'));
    }

    componentDidMount() {
        this.initCvs();
    }

    //初始化消息
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
        let resultData = await Ha.queryCvs({ mtId: this.id });
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
        values['mt'] = this.id;
        values['userId'] = this.user.id;
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
    //返回列表
    backList = e => {
        this.props.history.push('/home/allmt');
    }

    //拼接 Mt jsx
    getMt = () => {
        this.initMt();
        const mtData = this.MtData;
        return (
            <div>
                <Card
                    style={{ width: '100%', marginBottom: 30 }}
                    size='small'
                    hoverable
                    extra={<Button onClick={this.backList}>返回列表</Button>}
                    title={<div>
                        <Avatar
                            src={avatar}
                            alt="Han Solo"
                        />
                        <span style={{ margin: 20 }}>{mtData.userName}</span>
                    </div>}
                    cover={
                        <div>
                            <p style={{ padding: 10, fontSize: 16 }}>{mtData.message}</p>
                            {
                                isEmpty(mtData.pics) ? null : mtData.pics.map(e => {
                                    return (<img
                                        alt={e.title}
                                        src={e.path}
                                        style={{ margin: 20, height: 150 }}
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

    showDelete = info => {
        if (this.user.id === info.userId)
            return (< Tooltip title='刪除评论' >
                <WrapButton type='link' icon={<DeleteOutlined />} onClick={this.deleteCv} info={info} />
            </Tooltip>);
    }

    //刪除评论
    deleteCv = async (info, _) => {
        this.setState({
            loading: true
        });
        const commentId = info.info.id;
        let resultData = await Ha.deleteComment({ commentId });
        if (resultData && resultData.state === 'success') {
            const newCvs = [...this.state.Cvs];
            let index = newCvs.findIndex(e => e.id === commentId);
            if (index > -1) {
                newCvs.splice(index, 1);
                this.setState({
                    Cvs: newCvs,
                    loading: false
                }, () => notification.success({
                    description: '刪除成功！',
                    message: "提示",
                }));
            }
        } else {
            this.setState({
                loading: false
            }, () => notification.error({
                description: '刪除失败！',
                message: "提示",
            }));
        }
    }

    //拼接 Cvs
    getCvs = () => {
        const { Cvs } = this.state;
        if (isEmpty(Cvs)) return <Empty />
        let i = 0;
        let resultData = Cvs.map(e => (
            <div>
                <Comment
                    actions={[<span>第{++i}楼</span>, this.showDelete(e)]}
                    author={<a>{e.userName}</a>}
                    avatar={
                        <Avatar
                            src={avatar}
                        />
                    }
                    content={
                        <div>
                            <div>
                                <Rate disabled value={e.stars} />
                            </div>
                            <p style={{ fontSize: 16 }}>
                                {e.comment}
                            </p>
                        </div>
                    }
                    datetime={
                        <span>{Format(new Date(e.commentTime))}</span>
                    }
                />
            </div>
        ));
        return resultData;
    }


    render() {
        const { loading, Cvs } = this.state;
        return (
            <Spin size="large" tip="loding" spinning={loading}>
                <div style={{ padding: 20 }}>
                    <Tabs>
                        <TabPane
                            tab={"详细"}
                        >
                            {this.getMt()}
                        </TabPane>
                    </Tabs>
                    <Tabs>
                        <TabPane
                            tab='评论区'
                        >
                            <div>
                                <Avatar
                                    size='large'
                                    src={avatar}
                                />
                                <Button type="link"
                                    onClick={() => this.addForm.current.showModal()}
                                >
                                    <Input placeholder='我也来说一句' style={{ margin: 20 }} />
                                    <CommentOutlined />
                                </Button>
                                <div style={{/* height: 200, overflow: 'auto'*/ }}>
                                    {isEmpty(Cvs) ? <Empty description='暂无评论' /> : this.getCvs()}
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <AddCv ref={this.addForm} submitCv={this.submitCv} />
                </div>
            </Spin>
        );
    }
}

export default McCard;