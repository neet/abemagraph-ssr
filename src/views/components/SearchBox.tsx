import * as React from 'react';
import * as _ from 'lodash';

import { Glyphicon } from './Glyphicon';
import { markLongName, MarkType, markName, SortType, sortType } from '../constant/const';
import { ParsedQuery } from '../../types/abemagraph';
import { validateAndParseSearch } from '../../utils/search';

export class SearchBox extends React.Component<{
    channels: string[],
    search: string,
    onChange?: (search: string) => void,
    onSearchClick?: (search: string) => void
}, { errors: string[] }> {
    constructor(props) {
        super(props);
        this.state = {
            errors: []
        };
    }

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange)
            this.props.onChange(e.target.value);
    }

    componentWillUpdate(nextProps: { search: string }) {
        if (nextProps.search !== this.props.search) {
            this.validateSearchDebounce();
        }
    }

    setOption(e: React.MouseEvent<{}>, name: string, value: string, multiple = false) {
        e.preventDefault();
        const nextSearch = this.props.search.replace(new RegExp(`${name}:${multiple ? value : '\\S+'}`, 'ig'), '')
            .concat(` ${name}:${value}`).replace(/\s+/g, ' ').trim();
        if (this.props.onChange)
            this.props.onChange(nextSearch);
    }

    validateSearch() {
        const [errors] = validateAndParseSearch(this.props.search);
        this.setState({ errors });
        return errors.length === 0;
    }
    private validateSearchDebounce = _.debounce(this.validateSearch, 50);

    onSubmit(e: React.FormEvent<{}>) {
        e.preventDefault();
        if (this.validateSearch()) {
            if (this.props.onSearchClick)
                this.props.onSearchClick(this.props.search);
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <form className='form-inline' onSubmit={e => this.onSubmit(e)}>
                <div className={['input-group'].concat(errors.length !== 0 ? ['has-error'] : []).join(' ')}>
                    <input type='text' name='q' className='form-control' size={80}
                        placeholder='channel:anime24 until:now' value={this.props.search}
                        onChange={e => this.onChange(e)} />
                    <span className='input-group-btn'>
                        <button type='button' className='btn btn-success dropdown-toggle' data-toggle='dropdown'>
                            <span className='caret'></span>
                            <span className='sr-only'>Toggle Dropdown</span>
                        </button>
                        <ul className='dropdown-menu'>
                            <li><a onClick={e => this.setOption(e, 'since', 'now')} href='#'>未来の番組</a></li>
                            <li><a onClick={e => this.setOption(e, 'until', 'now')} href='#'>過去の番組</a></li>
                            <li role='separator' className='divider'></li>
                            <li><a onClick={e => this.setOption(e, 'sort', 'start/asc')} data-query='sort:' href='#'>開始時間/昇順</a></li>
                            <li><a onClick={e => this.setOption(e, 'sort', 'start/desc')} href='#'>開始時間/降順</a></li>
                            <li><a onClick={e => this.setOption(e, 'sort', 'title/asc')} href='#'>タイトル/昇順</a></li>
                            <li><a onClick={e => this.setOption(e, 'sort', 'title/desc')} href='#'>タイトル/降順</a></li>
                            <li role='separator' className='divider'></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'first', true)} href='#'>初回</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'last', true)} href='#'>最終回</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'live', true)} href='#'>生放送</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'bingeWatching', true)} href='#'>一挙</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'recommendation', true)} href='#'>注目番組</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'newcomer', true)} href='#'>新番組</a></li>
                            <li role='separator' className='divider'></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'timeshift', true)} href='#'>タイムシフトあり</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'timeshiftFree', true)} href='#'>無料タイムシフトあり</a></li>
                            <li><a onClick={e => this.setOption(e, 'flag', 'drm', true)} href='#'>DRM保護あり</a></li>
                        </ul>

                        <button type='submit'
                            disabled={errors.length !== 0} className='btn btn-info'>
                            <Glyphicon glyph='search' /> 検索する
                        </button>
                    </span>
                </div>
                <ul className='help-block'>
                    {errors.map(error => <li key={error}><Glyphicon glyph='warning-sign' /> {error}</li>)}
                </ul>
            </form>
        );
    }
}