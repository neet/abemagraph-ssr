import * as React from 'react';
import { pure } from 'recompose';
import * as moment from 'moment';

import { PageHeader } from '../components/PageHeader';
import { ReduxProps, connect } from '../utils/connect';
import { AllLog } from '../../types/abemagraph';
import { RouteComponentProps } from 'react-router-dom';
import { Title } from '../components/RouterControl';
import { Glyphicon } from '../components/Glyphicon';
import { Channel } from '../../types/abema';
import { Loader } from '../components/Loader';
import { ErrorPage } from '../components/Error';
import { Highcharts, Highstock } from '../components/Highcharts';
import * as Datetime from 'react-datetime';

type Props = ReduxProps<{
    date: moment.Moment,
    log?: AllLog,
    isFailed: boolean,
    channels: Channel[],
    logChannels: string[],
    failedCode: number
}> & RouteComponentProps<{ date: string }>;
class All extends React.Component<Props, { isMounted: boolean }>{
    constructor(props) {
        super(props);
        this.state = { isMounted: false };
    }

    componentWillMount() {
    }
    componentDidMount() {
        this.setState({ isMounted: true });
        if (this.props.channels.length === 0)
            this.props.actions.app.fetchChannels();

        const date = this.props.match.params.date ? moment(this.props.match.params.date, 'YYYYMMDD') : moment();
        if (date) this.props.actions.all.fetchAll(date);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.match.params !== this.props.match.params) {
            this.props.actions.all.invalidateAll();
            this.componentDidMount();
        }
    }
    componentWillUnmount() {
        this.props.actions.all.invalidateAll();
    }
    private findChannelName(channelId: string) {
        const channel = this.findChannel(channelId);
        return channel ? channel.name : channelId;
    }
    private findChannel(channelId: string) {
        return this.props.channels.find(ch => ch.id === channelId);
    }
    private createAllGraph(type: 'view' | 'comment') {
        if (!this.props.log) throw Error();
        const title = type === 'view' ? '閲覧数' : 'コメント数';
        return {
            chart: { zoomType: 'x' },
            title: { text: title + '/min' },
            xAxis: {
                title: {
                    text: '時間',
                },
                type: 'datetime',
                min: this.props.date.startOf('day').unix() * 1000,
                max: this.props.date.startOf('day').clone().add(1, 'day').unix() * 1000,
            },
            yAxis: {
                title: {
                    text: title + '/min',
                },
                min: 0,
            },
            series: [{
                name: title + '/min',
                data: this.props.log.map(log => [log.time * 1000, log[type]]) as Array<[number, number]>
            }]
        };
    }
    private createChannelGraph(type: 'view' | 'comment') {
        if (!this.props.log) throw Error();
        const log = this.props.log;
        const title = type === 'view' ? '閲覧数' : 'コメント数';
        const channels = this.props.logChannels;
        return {
            chart: { zoomType: 'x', height: 600 },
            title: { text: title + '/min' },
            xAxis: {
                title: {
                    text: '時間',
                },
                type: 'datetime',
                min: this.props.date.startOf('day').unix() * 1000,
                max: this.props.date.startOf('day').clone().add(1, 'day').unix() * 1000,
            },
            yAxis: {
                title: {
                    text: title + '/min',
                },
                min: 0,
            },
            series: channels.map(ch => ({
                name: this.findChannelName(ch),
                data: log.map(item => item.channels[ch] ? [item.time * 1000, Math.floor(item.channels[ch][type])] : null).filter(n => !!n) as Array<[number, number]>
            })),
            legend: {
                enabled: true
            },
            rangeSelector: {
                enabled: false
            }
        };
    }
    render() {
        if (this.props.isFailed) return <ErrorPage code={this.props.failedCode} />;
        if (!this.props.log) return <Loader />;
        const { date, log } = this.props;
        const dateStr = date.format('YYYY/MM/DD');
        const today = moment().endOf('day');
        return (
            <>
                <Title title={`${dateStr}の全体統計情報 - AbemaGraph`} />
                <PageHeader text={`${dateStr}の全体統計情報`}>
                    <div className='pull-right'>
                        {this.state.isMounted ? <Datetime
                            dateFormat='YYYY/MM/DD'
                            timeFormat={false}
                            isValidDate={current => current.isBefore(today)}
                            defaultValue={date}
                            onChange={nextDate => this.props.history.push(`/all/${(nextDate as moment.Moment).format('YYYYMMDD')}`)} /> : null}
                    </div>
                </PageHeader>
                <PageHeader mini text={<><Glyphicon glyph='comment' /> コメントの増加</>} />
                <Highcharts options={this.createAllGraph('comment')} />
                <PageHeader mini text={<><Glyphicon glyph='user' /> 閲覧数の増加</>} />
                <Highcharts options={this.createAllGraph('view')} />
                <PageHeader mini text={<><Glyphicon glyph='comment' /> コメント/ch</>} />
                <Highstock options={this.createChannelGraph('comment')} />
                <PageHeader mini text={<><Glyphicon glyph='user' /> 閲覧数/ch</>} />
                <Highstock options={this.createChannelGraph('view')} />
            </>
        );
    }
}

export default connect<{ date: moment.Moment, log?: AllLog, isFailed: boolean, failedCode: number, channels: Channel[], logChannels: string[] }>({
    date: state => typeof state.all.date === 'string' ? moment(state.all.date) : state.all.date,
    log: state => {
        if (!state.all.all) return undefined;
        const [offset, channels, data] = state.all.all;
        return data.map(([time, comment, view, channel]) => ({
            time: time + offset,
            comment,
            view,
            channels: channel.reduce((obj, item, index) => {
                if (item !== 0)
                    obj[channels[index]] = { comment: item[0], view: item[1] };
                return obj;
            }, {})
        }));
    },
    isFailed: state => !!state.all.allStatus,
    failedCode: state => state.all.allStatus || 0,
    channels: state => state.app.channels,
    logChannels: state => state.all.all ? state.all.all[1] : []
})(pure(All));