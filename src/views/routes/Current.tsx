import * as React from 'react';
import { pure } from 'recompose';
import * as moment from 'moment';

import { Container } from '../components/Container';
import { PageHeader } from '../components/PageHeader';
import { ReduxProps, connect } from '../utils/connect';
import { BroadcastSlot, Stats, BroadcastSortType } from '../../types/abemagraph';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Title } from '../components/RouterControl';
import { Glyphicon } from '../components/Glyphicon';
import { Channel } from '../../types/abema';
import { Mark } from '../components/Mark';
import { parse } from '../utils/querystring';
import { Loader } from '../components/Loader';
import { ErrorPage } from '../components/Error';

type ConnectedProps = {
    slots: Array<BroadcastSlot & { stats: Stats, vpm: number, cpm: number, channel?: Channel }>,
    sortType: BroadcastSortType,
    updated: number,
    isFetching: boolean,
    isFailed: boolean,
    viewTotal: number,
    commentTotal: number
};
class Current extends React.Component<ReduxProps<ConnectedProps> & RouteComponentProps<{}>, { mounted: boolean }>{
    constructor(props) {
        super(props);
        this.state = { mounted: false };
    }

    componentWillMount() {
        this.setSortBy();
    }
    componentDidMount() {
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
            const search: { sort?: BroadcastSortType } = parse(this.props.location.search);
            if (search.sort && ['v', 'c', 'vpm', 'cpm', 'ch'].includes(search.sort)) {
                this.props.actions.broadcast.setSortType(search.sort);
            }
        }
    }
    private setSortUrl(e: React.ChangeEvent<HTMLSelectElement>) {
        const sort = e.target.value || 'vpm';
        if (['v', 'c', 'vpm', 'cpm', 'ch'].includes(sort))
            this.props.history.replace(`?sort=${sort}`);
    }
    render() {
        const now = Date.now() / 1000;
        const { mounted } = this.state;
        const {
            isFailed,
            isFetching,
            slots,
            viewTotal,
            commentTotal,
            sortType
        } = this.props;

        if (isFetching) return <Loader />;
        if (isFailed) return <ErrorPage />;

        return (
            <>
                <Title title='AbemaTV情報サイト(非公式) AbemaGraph' />
                <PageHeader text='現在放送中の番組'>
                    <div className='pull-right'>
                        <select className='form-control' onChange={e => this.setSortUrl(e)} value={sortType}>
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
                    <dd>{viewTotal === 0 ? '不明' : viewTotal}</dd>
                    <dt>総コメント数 <Glyphicon glyph='comment' /></dt>
                    <dd>{commentTotal === 0 ? '不明' : commentTotal}</dd>
                </dl>
                <div className='list-group'>
                    {slots.map(slot => (
                        <Link to={`/details/${slot.id}`} className='list-group-item' key={slot.id}>
                            <h4 className='list-group-item-heading'>
                                <Mark mark={slot.mark} showItem={['first', 'last', 'live', 'newcomer', 'bingeWatching']} />
                                {slot.title}
                                <span className='pull-right label label-success'>{slot.channel ? slot.channel.name : slot.channelId}</span>
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

export default connect<ConnectedProps>({
    slots: ({ app, broadcast }) => {
        const now = Date.now();
        return broadcast.slots.map(slot => ({
            ...slot,
            stats: slot.stats || { view: 0, comment: 0, updated: now },
            vpm: slot.stats ? slot.stats.view / (now - slot.startAt) * 60 : 0,
            cpm: slot.stats ? slot.stats.comment / (now - slot.startAt) * 60 : 0,
            channel: app.channels.find(ch => ch.id === slot.channelId)
        })).sort((a, b) => {
            if (broadcast.sortType === 'v')
                return b.stats.view - a.stats.view;
            else if (broadcast.sortType === 'c')
                return b.stats.comment - a.stats.comment;
            else if (broadcast.sortType === 'cpm')
                return b.cpm - a.cpm;
            else if (broadcast.sortType === 'vpm')
                return b.vpm - a.vpm;
            else {
                if (a.channel && b.channel)
                    return a.channel.order - b.channel.order;
                else
                    return a.channelId.localeCompare(b.channelId);
            }
        });
    },
    sortType: ({ broadcast }) => broadcast.sortType,
    updated: state => state.broadcast.updated,
    isFailed: state => state.broadcast.isFailed,
    isFetching: state => state.broadcast.isFetching,
    viewTotal: ({ broadcast }) => broadcast.slots.reduce((total, item) => total += item.stats ? item.stats.view : 0, 0),
    commentTotal: ({ broadcast }) => broadcast.slots.reduce((total, item) => total += item.stats ? item.stats.comment : 0, 0)
})(pure(Current));