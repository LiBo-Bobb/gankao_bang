import React, {Component} from 'react';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import './App.css';
import {
    LoadMore,
    Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    Tab,
    TabBody,
    NavBar,
    NavBarItem,
    Article
} from 'react-weui';
import request from 'superagent';
const API = typeof window.apiSite != 'undefined' ? window.apiSite : '/';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            ranking: {
                today: null,
                aWeek: null,
                aMonth: null,
                aTerm: null
            }
        };
    }
    componentWillMount() {
        this.getData('today');
    }
    getData = (scope) => {
        request.get(
            API + 'api/ranking'
        ).query({scope}).then(res => {
            //对象
            const {ranking} = this.state;
            ranking[scope] = res.body;
            console.log("数据");
            console.log(res.body);
            this.setState({
                ranking
            });
        }).catch(err => {
            console.dir(err);
        });
    };
    // 点击Tab事件
    handleTabClick = (scope) => {
        let tab = 0;
        switch (scope) {
            case 'today':
                tab = 0;
                break;
            case 'aWeek':
                tab = 1;
                break;
            case 'aMonth':
                tab = 2;
                break;
            case 'aTerm':
                tab = 3;
            default:

        }
        this.setState({tab});
        this.getData(scope);
    };

    render() {
        //获取到最新的tab和
        //测试、、、、、
        const {ranking, tab} = this.state;
        const rankingArr = new Array();
        for (let item in ranking) {
            if (!ranking[item]) {
                ranking[item] = {};
            }
            ranking[item].id = item;
            rankingArr.push(ranking[item]);
        }
        return (
            <div className="App">
                <Tab>
                    <NavBar>
                        <NavBarItem active={tab === 0}
                                    onClick={e => this.handleTabClick('today')}>今天</NavBarItem>
                        <NavBarItem active={tab === 1}
                                    onClick={e => this.handleTabClick('aWeek')}>一周</NavBarItem>
                        <NavBarItem active={tab === 2}
                                    onClick={e => this.handleTabClick('aMonth')}>一个月</NavBarItem>
                        <NavBarItem active={tab === 3}
                                    onClick={e => this.handleTabClick('aTerm')}>本学期</NavBarItem>
                    </NavBar>
                    <TabBody>
                        {rankingArr.map((item, index) => {
                            let currentRanking = null;
                            if (item.myRanking != undefined) {
                                currentRanking = item;
                            }
                            return (
                                <Article key={'a' + index} style={{display: tab === index ? null : 'none'}}>
                                    {currentRanking != null ? (currentRanking.rankingTopTen.length > 0 ? currentRanking.rankingTopTen.map((topItem, index) => {
                                        let b;
                                        if (index === 0) {
                                            b = "white";
                                        } else if (index === 1) {
                                            b = "gray";
                                        } else if (index === 2) {
                                            b = "white"
                                        } else {
                                            b = "white"
                                        }
                                        let topClassName = '';
                                        if (index < 3) {
                                            topClassName = 'top' + (index + 1);
                                        } else {
                                            topClassName = 'top-normal';
                                        }
                                        return <Panel key={index}>
                                            <PanelBody>
                                                <MediaBox type="appmsg" href="javascript:void(0);">
                                                    <MediaBoxHeader><img src={topItem.logo}/></MediaBoxHeader>
                                                    <MediaBoxBody>
                                                        <MediaBoxTitle>{topItem.nick_name}</MediaBoxTitle>
                                                        <MediaBoxDescription>
                                                            学习时长:{topItem.studyDuration}
                                                        </MediaBoxDescription>
                                                        <div style={this.state.style}>
                                                        </div>
                                                    </MediaBoxBody>
                                                    <MediaBoxHeader>
                                                        <div className={`top ${topClassName}`} style={{
                                                            color: `${b}`
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                    </MediaBoxHeader>
                                                </MediaBox>
                                            </PanelBody>
                                        </Panel>
                                    }) : '榜单未公布') :  <LoadMore loading>加载中......</LoadMore>}
                                    {currentRanking != null ? (currentRanking.myRanking ? <Panel>
                                        <PanelBody>
                                            <MediaBoxTitle className="myCurrentRank">我当前的名次</MediaBoxTitle>
                                            <MediaBox type="appmsg" href="javascript:void(0);">
                                                <MediaBoxHeader><img
                                                    src={currentRanking.myRanking.logo}/></MediaBoxHeader>
                                                <MediaBoxBody>
                                                    <MediaBoxTitle>{currentRanking.myRanking.nick_name}</MediaBoxTitle>
                                                    <MediaBoxDescription>
                                                        学习时长:{currentRanking.myRanking.studyDuration}
                                                    </MediaBoxDescription>
                                                    <div style={this.state.style}>
                                                    </div>
                                                </MediaBoxBody>
                                                <MediaBoxHeader
                                                    className="currentRank">{currentRanking.myRanking.top}{/\d+/.test(currentRanking.myRanking.top) ? '名' : ''}</MediaBoxHeader>
                                            </MediaBox>
                                        </PanelBody>
                                    </Panel> : '') : ''}
                                </Article>
                            );
                        })}
                    </TabBody>
                </Tab>

            </div>
        );
    }
}

export default App;
