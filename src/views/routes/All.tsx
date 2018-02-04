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
import { Highcharts } from '../components/Highcharts';

class All extends React.Component<ReduxProps<{
    date: moment.Moment,
    log?: AllLog,
    isFailed: boolean,
    channels: Channel[]
}> & RouteComponentProps<{ date: string }>>{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        if (this.props.channels.length === 0) this.props.actions.app.fetchChannels();

        const date = this.props.match.params.date ? moment(this.props.match.params.date, 'YYYYMMDD') : moment();
        if (date) this.props.actions.all.fetchAll(date);
    }

    componentDidUpdate(prevProps: RouteComponentProps<{}>) {
        if (prevProps.match.params !== this.props.match.params) {
            this.componentDidMount();
        }
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
    render() {
        if (!this.props.log) return <Loader />;
        if (this.props.isFailed) return <ErrorPage />;
        const { date, log } = this.props;
        const dateStr = this.props.date.format('YYYY/MM/DD');
        return (
            <>
            <Title title={`${dateStr}の全体統計情報 - AbemaGraph`} />
            <PageHeader text={`${dateStr}の全体統計情報`}>
                <div className='pull-right'>
                </div>
            </PageHeader>
            <PageHeader mini text={<><Glyphicon glyph='comment' /> コメントの増加</>} />
            <Highcharts options={this.createAllGraph('comment')} />
            <PageHeader mini text={<><Glyphicon glyph='comment' /> 閲覧数の増加</>} />
            <Highcharts options={this.createAllGraph('view')} />
            </>
        );
    }
}

export default connect<{ date: moment.Moment, log?: AllLog, isFailed: boolean, channels: Channel[] }>({
    date: state => state.all.date,
    log: state => state.all.all,
    isFailed: state => state.all.isAllFailed,
    channels: state => state.app.channels
})(pure(All));