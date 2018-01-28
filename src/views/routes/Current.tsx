import * as React from 'react';
import { pure } from 'recompose';
import * as moment from 'moment';

import { Container } from '../components/Container';
import { PageHeader } from '../components/PageHeader';
import { ReduxProps, connect } from '../utils/connect';
import { BroadcastSlot } from '../../types/abemagraph';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Title } from '../components/RouterControl';
import { Glyphicon } from '../components/Glyphicon';
import { Channel } from '../../types/abema';
import { Mark } from '../components/Mark';
import { parse } from '../utils/querystring';
import { Loader } from '../components/Loader';
import { ErrorPage } from '../components/Error';

type Sort = 'v' | 'c' | 'vpm' | 'cpm' | 'ch';
class Current extends React.Component<ReduxProps<{
    slots: BroadcastSlot[],
    updated: number,
    channels: Channel[],
    isFetching: boolean,
    isFailed: boolean
}> & RouteComponentProps<{}>, { mounted: boolean, sortBy: Sort }>{
    constructor(props) {
        super(props);
        this.state = { mounted: false, sortBy: 'vpm' };
    }

    componentWillMount() {
        this.setSortBy();
    }
    componentDidMount() {
        if (this.props.slots.length > 0 && this.props.channels.length > 0 && this.props.channels.length !== this.props.slots.length)
            this.props.actions.app.fetchChannels();
        if (Date.now() - this.props.updated > 60 * 1000)
            this.props.actions.broadcast.fetchBroadcastSlots();
        this.setState({ mounted: true });
    }

    componentDidUpdate(prevProps: RouteComponentProps<{}>) {
        if (prevProps.location.search !== this.props.location.search) {
            this.componentDidMount();
            this.setSortBy();
        }
    }

    private setSortBy() {
        if (this.props.location.search) {
            const search: { sort?: Sort } = parse(this.props.location.search);
            if (search.sort && this.state.sortBy !== search.sort && ['v', 'c', 'vpm', 'cpm', 'ch'].indexOf(search.sort) >= 0) {
                this.setState({ sortBy: search.sort });
            }
        }
    }
    private findChannelName(channelId: string) {
        const channel = this.findChannel(channelId);
        return channel ? channel.name : channelId;
    }
    private findChannel(channelId: string) {
        return this.props.channels.find(ch => ch.id === channelId);
    }
    private setSortUrl(e: React.ChangeEvent<HTMLSelectElement>) {
        const sort = e.target.value || 'vpm';
        if (['v', 'c', 'vpm', 'cpm', 'ch'].indexOf(sort) >= 0)
            this.props.history.replace(`?sort=${sort}`);
    }
    render() {
        const now = Date.now() / 1000;
        const { mounted, sortBy } = this.state;

        if (this.props.isFetching) return <Loader />;
        if (this.props.isFailed) return <ErrorPage />;
        
        const slots = this.props.slots.map(slot => ({
            ...slot,
            stats: slot.stats || { view: 0, comment: 0, updated: now },
            vpm: slot.stats ? slot.stats.view / (now - slot.startAt) * 60 : 0,
            cpm: slot.stats ? slot.stats.comment / (now - slot.startAt) * 60 : 0
        })).sort((a, b) => {
            if (sortBy === 'v')
                return b.stats.view - a.stats.view;
            else if (sortBy === 'c')
                return b.stats.comment - a.stats.comment;
            else if (sortBy === 'cpm')
                return b.cpm - a.cpm;
            else if (sortBy === 'vpm')
                return b.vpm - a.vpm;
            else {
                const ach = this.findChannel(a.channelId);
                const bch = this.findChannel(b.channelId);
                if (ach && bch)
                    return ach.order - bch.order;
                else
                    return a.channelId.localeCompare(b.channelId);
            }
        });
        return (
            <>
            <Title title='AbemaTV情報サイト(非公式) AbemaGraph' />
            <PageHeader text='現在放送中の番組'>
                <div className='pull-right'>
                    <select className='form-control' onChange={e => this.setSortUrl(e)} value={sortBy}>
                        <option value='ch'>チャンネル順</option>
                        <option value='v'>閲覧数</option>
                        <option value='c'>コメント数</option>
                        <option value='vpm'>閲覧数の勢い</option>
                        <option value='cpm'>コメントの勢い</option>
                    </select>
                </div>
            </PageHeader>
            <dl className='dl-horizontal'>
                <dt>総閲覧数 <Glyphicon glyph='user' /></dt>
                <dd>{slots.reduce((total, item) => total += item.stats ? item.stats.view : 0, 0)}</dd>
                <dt>総コメント数 <Glyphicon glyph='comment' /></dt>
                <dd>{slots.reduce((total, item) => total += item.stats ? item.stats.comment : 0, 0)}</dd>
            </dl>
            <div className='list-group'>
                {slots.map(slot => (
                    <Link to={`/details/${slot.id}`} className='list-group-item' key={slot.id}>
                        <h4 className='list-group-item-heading'>
                            <Mark mark={slot.mark} showItem={['first', 'last', 'live', 'newcomer', 'bingeWatching']} />
                            {slot.title}
                            <span className='pull-right label label-success'>{this.findChannelName(slot.channelId)}</span>
                        </h4>
                        <p className='list-group-item-text'>
                            {`${moment.unix(slot.startAt).format('YYYY/MM/DD(ddd) HH:mm:ss')} ~ ${moment.unix(slot.startAt + slot.duration).format('HH:mm:ss')}`}
                            <br />
                            {slot.stats ? (
                                `閲覧数:${slot.stats.view} (${mounted ? slot.vpm.toFixed(2) : '-'} vpm) ` +
                                `コメント:${slot.stats.comment} (${mounted ? slot.cpm.toFixed(2) : '-'} cpm)`
                            ) : '閲覧数: - (- vpm) コメント: - (- cpm)'}
                        </p>
                    </Link>
                ))}
            </div>
            </>
        );
    }
}

export default connect<{ slots: BroadcastSlot[], updated: number, channels: Channel[], isFetching: boolean, isFailed: boolean }>({
    slots: state => state.broadcast.slots,
    updated: state => state.broadcast.updated,
    channels: state => state.app.channels,
    isFailed: state => state.broadcast.isFailed,
    isFetching: state => state.broadcast.isFetching
})(pure(Current));