import * as React from 'react';
import { ListGroup, Glyphicon } from 'react-bootstrap';
import { pure } from 'recompose';
import * as moment from 'moment';

import { Container } from '../components/Container';
import { PageHeader } from '../components/PageHeader';
import { ReduxProps, connect } from '../utils/connect';
import { BroadcastSlot } from '../../types/abemagraph';
import { Link } from 'react-router-dom';


class Current extends React.Component<ReduxProps<{ slots: BroadcastSlot[], updated: number }>>{
    componentDidMount() {
        if (this.props.updated > 60 * 1000)
            this.props.actions.app.fetchBroadcastSlots();
    }

    render() {
        if (this.props.slots.length > 0) {
            const now = Math.floor(Date.now() / 1000);
            return (
                <div>
                    <PageHeader text='現在放送中の番組'>
                    </PageHeader>
                    <dl className='dl-horizontal'>
                        <dt>総閲覧数 <Glyphicon glyph='user' /></dt>
                        <dd>{this.props.slots.reduce((total, item) => total += item.stats ? item.stats.view : 0, 0)}</dd>
                        <dt>総コメント数 <Glyphicon glyph='comment' /></dt>
                        <dd>{this.props.slots.reduce((total, item) => total += item.stats ? item.stats.comment : 0, 0)}</dd>
                    </dl>
                    <ListGroup>
                        {this.props.slots.map(slot => (
                            <Link to={`/details/${slot.id}`} className='list-group-item' key={slot.id}>
                                <h4 className='list-group-item-heading'>
                                    {slot.title}
                                    <span className='pull-right label label-success'>{slot.channelId}</span>
                                </h4>
                                <p className='list-group-item-text'>
                                    <span>{moment.unix(slot.startAt).format('YYYY/MM/DD(ddd) HH:mm:ss')} ~ {moment.unix(slot.startAt + slot.duration).format('HH:mm:ss')}</span>
                                    <br />
                                    {slot.stats ? (
                                        `閲覧数:${slot.stats.view} (${(slot.stats.view / (now - slot.startAt) * 60).toFixed(2)}vpm) ` +
                                        `コメント:${slot.stats.comment} (${(slot.stats.comment / (now - slot.startAt) * 60).toFixed(2)}vpm)`
                                    ) : ''}
                                </p>
                            </Link>
                        ))}
                    </ListGroup>
                </div>
            );
        }
        return null;
    }
}

export default connect<{ slots: BroadcastSlot[], updated: number }>({
    slots: state => state.app.broadcastSlots,
    updated: state => Date.now() - state.app.broadcastSlotUpdated
})(pure(Current));