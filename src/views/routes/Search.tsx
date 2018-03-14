import * as React from 'react';
import { pure } from 'recompose';
import * as moment from 'moment';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Container } from '../components/Container';
import { PageHeader } from '../components/PageHeader';
import { ReduxProps, connect } from '../utils/connect';
import { BroadcastSlot, SearchResultItem } from '../../types/abemagraph';

import { Title } from '../components/RouterControl';
import { Glyphicon } from '../components/Glyphicon';
import { Channel } from '../../types/abema';
import { Mark } from '../components/Mark';
import { parse } from '../utils/querystring';
import { Loader } from '../components/Loader';
import { ErrorPage } from '../components/Error';
import { SearchBox } from '../components/SearchBox';

type SearchResultItemWithChName = SearchResultItem & { channelName: string };

const SearchListItem = ({ item }: { item: SearchResultItemWithChName }) =>
    <Link to={`/details/${item.id}`} className='list-group-item'>
        <h4 className='list-group-item-heading'>
            <Mark mark={item.flags} showItem={['first', 'last', 'live', 'bingeWatching', 'recommendation']} />
            <span dangerouslySetInnerHTML={{ __html: item.title }} />
            <span className='pull-right label label-success'>{item.channelName}</span>
        </h4>
        <p className='list-group-item-text'>
            {moment(item.start).format('YYYY/MM/DD(ddd) HH:mm')} ~ {moment(item.end).format('HH:mm')}
            <br />
            <span dangerouslySetInnerHTML={{ __html: item.content }} />
        </p>
    </Link>;
type ConnectedProps = {
    query: string,
    page: number,
    hits: SearchResultItemWithChName[],
    isFetching: boolean,
    isFailed: boolean,
    isSuccess: boolean,
    hasResult: boolean,
    hasMore: boolean,
    totalPage: number,
    total: number,
    took: number
};
type SearchProps = RouteComponentProps<{}> & ReduxProps<ConnectedProps>;
class Search extends React.Component<SearchProps, { query: string }> {
    constructor(props) {
        super(props);
        this.state = { query: '' };
    }

    componentDidMount() {
        const qs = parse(this.props.location.search);
        this.setState({ query: qs.q || '' });
        if (qs.q && qs.q.length > 0) {
            let page = qs.page ? Number(qs.page) : 0;
            if (isNaN(page)) page = 0;
            this.props.actions.search.fetchSearch(qs.q, page);
        }
    }

    componentDidUpdate(prevProps: SearchProps) {
        if (prevProps.location !== this.props.location) {
            this.props.actions.search.invalidateSearch();
            this.componentDidMount();
        }
    }

    componentWillUnmount() {
        this.props.actions.search.invalidateSearch();
    }

    onChange(query: string) {
        this.setState({ query });
    }

    onSubmit(query: string) {
        this.props.history.push(`/search?q=${encodeURI(query)}`);
    }

    changePage(page: number) {
        this.props.history.push(`/search?q=${encodeURI(this.props.query)}&page=${page}`);
    }

    render() {
        const {
            query,
            isFetching,
            isFailed,
            isSuccess,
            hasResult,
            hasMore,
            hits,
            totalPage,
            page,
            total,
            took
        } = this.props;
        return (
            <>
                <Title title={query.length > 0 ? `${query} - 検索結果 - AbemaGraph` : '番組検索 - AbemaGraph'} />
                <PageHeader text={query.length > 0 ? `${query} - 検索結果` : '検索'} />
                <SearchBox channels={[]}
                    search={this.state.query}
                    onChange={q => this.onChange(q)}
                    onSearchClick={q => this.onSubmit(q)} />
                <hr />
                {isFetching && query.length > 0 ? <Loader /> : null}
                {isFailed ? <div className='alert alert-danger'>エラーが発生しました</div> : null}
                {isSuccess ? <>
                    {hasResult ? <>
                        <p>検索結果: {total} 件、{page * 50}から{Math.min((page + 1) * 50, total)}まで表示中 ({took / 1000} 秒)</p>
                        {hits.map(hit => <SearchListItem key={hit.id} item={hit} />)}
                        <ul className='pager'>
                            <li>
                                <button className='btn btn-primary' disabled={page === 0} onClick={() => this.changePage(page - 1)}>
                                    <span>&larr;</span> 前のページ
                                </button>
                            </li>
                            <li>{page + 1} / {totalPage}</li>
                            <li>
                                <button className='btn btn-primary' disabled={!hasMore} onClick={() => this.changePage(page + 1)}>
                                    次のページ <span>&rarr;</span>
                                </button>
                            </li>
                        </ul>
                    </> : <div className='alert alert-warning'>該当する番組がありません(キーワードのミスはありませんか？)</div>}
                </> : null}
            </>
        );
    }
}

export default connect<ConnectedProps>({
    query: ({ search }) => search.query,
    page: ({ search }) => search.page,
    hits: ({ app, search }) => search.result ? search.result.hits.map(hit => {
        const channel = app.channels.find(c => c.id === hit.channelId);
        return {
            ...hit,
            channelName: channel ? channel.name : hit.channelId
        };
    }) : [],
    isSuccess: ({ search }) => search.status === false && !!search.result,
    hasResult: ({ search }) => search.result ? search.result.hits.length > 0 : false,
    hasMore: ({ search }) => search.result ? (search.page + 1) * 50 < search.result.total : false,
    isFailed: ({ search }) => search.status !== false,
    isFetching: ({ search }) => !search.result && search.status === false,
    totalPage: ({ search }) => search.result ? Math.ceil(search.result.total / 50) : 0,
    total: ({ search }) => search.result ? search.result.total : 0,
    took: ({ search }) => search.result ? search.result.took : 0,
})(pure(Search));