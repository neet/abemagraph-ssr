import * as React from 'react';
import { pure } from 'recompose';
import { RouteComponentProps } from 'react-router';
import * as moment from 'moment';
import { Link } from 'react-router-dom';

import { connect, ReduxProps } from '../utils/connect';
import { Slot, Channel } from '../../types/abema';
import { PageHeader } from '../components/PageHeader';
import { Mark } from '../components/Mark';
import { Glyphicon } from '../components/Glyphicon';
import * as _ from 'lodash';
import { Loader } from '../components/Loader';

class Details extends React.Component<ReduxProps<{ slot?: Slot, channel?: Channel }> & RouteComponentProps<{ slotId: string }>, { now: number }> {
    constructor(props) {
        super(props);
        this.state = { now: 0 };
    }
    componentDidMount() {
        const { slot, channel, match } = this.props;
        if (slot && !channel) {
            this.props.actions.app.fetchChannels();
        }
        if ((!slot && match.params.slotId) || (slot && match.params.slotId !== slot.id)) {
            this.props.actions.app.fetchSlot(match.params.slotId);
        }
        this.setState({ now: Date.now() / 1000 });
    }
    componentWillReceiveProps(nextProps: ReduxProps<{ slot?: Slot, channel?: Channel }> & RouteComponentProps<{ slotId: string }>) {
        if (this.props.match.params.slotId !== nextProps.match.params.slotId) {
            this.componentDidMount();
        }
    }
    componentWillUnmount() {
        this.props.actions.app.unsetSlot();
    }
    render() {
        const { slot, channel } = this.props;
        const { now } = this.state;
        if (slot && channel) {
            const isEnd = slot.endAt < this.state.now;
            const isOnAir = this.state.now > slot.startAt && this.state.now < slot.endAt;
            const officialLink = `https://abema.tv/channels/${slot.channelId}/slots/${slot.id}`;
            const mark = [...Object.keys(slot.mark), ...Object.keys(slot.flags)];
            const series = slot.programs[0] && slot.programs[0].series && slot.programs[0].series.id;
            return (
                <>
                <PageHeader text={(
                    <>
                    <Mark mark={mark} showItem={['first', 'last', 'live', 'newcomer', 'bingeWatching']} />
                    {`${slot.title} - 詳細情報`}
                    </>
                )}>
                    <div className='pull-right'>
                        {now > 0 && now > slot.startAt ? (
                            isOnAir ?
                                (
                                    <a href={`https://abema.tv/now-on-air/${slot.channelId}?utm_source=abemagraph`} className='btn btn-primary'>
                                        <b>現在放送中！</b>
                                    </a>
                                ) : slot.flags.timeshift ? (
                                    slot.timeshiftEndAt < now ?
                                        (<button className='btn btn-info' disabled>放送終了(TS期限切れ)</button>)
                                        : (slot.flags.timeshiftFree && slot.timeshiftFreeEndAt > now ?
                                            <a href={officialLink} className='btn btn-primary'>無料タイムシフト</a> :
                                            <a href={officialLink} className='btn btn-info'>タイムシフト</a>
                                        )
                                ) : <button className='btn btn-info' disabled>放送終了(TSなし)</button>) : null}
                    </div>
                </PageHeader>
                <PageHeader mini text={<><Glyphicon glyph='info-sign' /> 番組情報</>} />
                <dl className='dl-horizontal'>
                    <dt>番組名</dt>
                    <dd>
                        <Mark mark={mark} showItem={['first', 'last', 'live', 'newcomer', 'bingeWatching', 'recommendation', 'drm']} />
                        {slot.title}
                    </dd>
                    <dt>チャンネル</dt>
                    <dd>
                        <Link to={`/search?q=channel:${channel.id}+since:now`}>{channel.name} ({channel.id})</Link>
                    </dd>
                    <dt><Glyphicon glyph='calendar' /> 放送日時</dt>
                    <dd>
                        {`${moment.unix(slot.startAt).format('YYYY/MM/DD(ddd) HH:mm:ss')} ~ ${moment.unix(slot.endAt).format('HH:mm:ss')} ` +
                            `(${Math.floor((slot.endAt - slot.startAt) / 60)}分` +
                            (isEnd ? ' / 終了' : isOnAir ? `開始から約${((now - slot.startAt) / 60).toFixed(1)}分` : '') + ')'}
                    </dd>
                    <dt><Glyphicon glyph='link' /> 公式ページ</dt>
                    <dd><a href={officialLink}>{officialLink}</a></dd>
                    {series ? (
                        <><dt>シリーズ</dt>
                        <dd>
                            <Link to={`/search?q=series:${series}`}>{series}</Link>
                            {(slot.slotGroup ? <> (グループ: <Link to={`/search?q=group:${slot.slotGroup.id}`}>{slot.slotGroup.id}</Link>)</> : null)}
                        </dd></>) : null}
                    {slot.hashtag ? (<>
                        <dt>ハッシュタグ <Glyphicon glyph='tag' /></dt>
                        <dd><a href={`https://twitter.com/hashtag/${slot.hashtag}`}>{slot.hashtag}</a></dd>
                        </>) : null}
                    <dt><Glyphicon glyph='time' /> タイムシフト</dt>
                    <dd>{slot.flags.timeshift ?
                        slot.flags.timeshiftFree && slot.timeshiftFreeEndAt > now ?
                            `無料 - ${moment.unix(slot.timeshiftFreeEndAt || slot.timeshiftEndAt).format('MM/DD(ddd) HH:mm')}まで` :
                            `プレミアム - ${moment.unix(slot.timeshiftEndAt).format('MM/DD(ddd) HH:mm')}まで` : 'なし'}</dd>
                </dl>
                <pre>{slot.content}</pre>
                <div className='row'>
                    <div className='col-sm-4'>
                        <dl>
                            <dt>キャスト</dt>
                            {_.uniq(_.flatMap(slot.programs, p => p.credit.casts || [])).map(n => <dd key={n}>{n}</dd>)}
                        </dl>
                    </div>
                    <div className='col-sm-4'>
                        <dl>
                            <dt>スタッフ</dt>
                            {_.uniq(_.flatMap(slot.programs, p => p.credit.crews || [])).map(n => <dd key={n}>{n}</dd>)}
                        </dl>
                    </div>
                </div>
                <hr />
                <hr />
                {_.uniq(_.flatMap(slot.programs, p => p.credit.copyrights || [])).map(n => <span className='center' key={n}>{n}</span>)}
                </>
            );
        }
        return <Loader />;
    }
}

export default connect<{ slot?: Slot, channel?: Channel }>({
    slot: state => state.app.slot,
    channel: ({ app: { slot, channels } }) => slot ? channels.find(ch => ch.id === slot.channelId) : undefined
})(pure(Details));