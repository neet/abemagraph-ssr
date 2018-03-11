import * as React from 'react';
import { Glyphicon } from './Glyphicon';
import { Checkbox } from './Checkbox';
import { markLongName, MarkType, markName } from '../constant/const';
import { parse } from 'search-query-parser';
import * as Datetime from 'react-datetime';
import Select from 'react-select';
import * as _ from 'lodash';
import * as moment from 'moment';

const queryOptions = {
    keywords: ['channel', 'flag', 'since', 'until', 'sort']
};

const sortType = {
    'start/asc': '開始時間/昇順',
    'start/desc': '開始時間/降順',
    'title/asc': 'タイトル/昇順',
    'title/desc': 'タイトル/降順'
};
type SortType = 'start/asc' | 'start/desc' | 'title/asc' | 'title/desc';
type ParsedQuery = {
    keyword: string,
    channel: string[],
    flag: string[],
    sort: SortType | null,
    since: [string, moment.Moment] | null,
    until: [string, moment.Moment] | null
};

export class SearchBox extends React.Component<{
    channels: string[]
}, {
        search: string,
        flags: MarkType[],
        isMounted: boolean
    }> {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            flags: [],
            isMounted: false
        };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    updateSearch(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ search: e.target.value });
    }

    changeFlag(value: Array<{ value: MarkType }>) {
        this.setState({ flags: value.map(v => v.value) });
    }

    validateSearch() {
        const { search: query } = this.state;
        const parsed = parse(query, queryOptions);
        if (typeof parsed === 'string') {
            return { keyword: parsed };
        } else {
            const errors: string[] = [];
            const search: ParsedQuery = {
                keyword: (parsed.text || '').trim(),
                channel: _.flatMap([parsed.channel || []], m => m as string),
                flag: [],
                sort: null,
                since: null,
                until: null
            };
            if (parsed.sort) {
                if (typeof parsed.sort !== 'string') {
                    errors.push('ソート指定は一種類のみです');
                } else if (!Object.keys(sortType).includes(parsed.sort)) {
                    errors.push(`ソート種別が不正です: ${parsed.sort}`);
                } else {
                    search.sort = parsed.sort as SortType;
                }
            }
            const flags = _.flatMap([parsed.flag || []], m => m as string);
            search.flag = flags.filter(flag => Object.keys(markName).includes(flag));
            if (search.flag.length !== flags.length) {
                errors.push(`不正なフラグがあります: ${flags.filter(flag => !search.flag.includes(flag)).join(',')}`);
            }
            if (parsed.until) {
                if (typeof parsed.until !== 'string') {
                    errors.push('終了時間指定は複数できません');
                } else {
                    const until = moment(parsed.until);
                    if (until.isValid())
                        search.until = [parsed.until, until];
                    else
                        errors.push('終了時間指定が不正です');
                }
            }
            if (parsed.since) {
                if (typeof parsed.since !== 'string') {
                    errors.push('開始時間指定は複数できません');
                } else {
                    const since = moment(parsed.since);
                    if (since.isValid())
                        search.since = [parsed.since, since];
                    else
                        errors.push('開始時間指定が不正です');
                }
            }
        }
    }
    applyAdvSearch() {

    }

    render() {
        const { isMounted } = this.state;
        return (
            <>
                <div className='form-inline' >
                    <div className='input-group'>
                        <span className='input-group-btn'>
                            <button type='button' className='btn btn-success'>
                                <Glyphicon glyph='cog' />
                            </button>
                        </span>
                        <input type='text' name='q' className='form-control' size={80}
                            placeholder='channel:anime24 until:now' value={this.state.search}
                            onChange={e => this.updateSearch(e)} />
                        <span className='input-group-btn'>
                            <button type='submit' className='btn btn-info'><Glyphicon glyph='search' /> 検索する</button>
                        </span>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>詳細検索</div>
                            <div className='panel-body row'>
                                <div className='col-md-4'>
                                    <div className='form-group'>
                                        <label>フラグ</label>
                                        <div>
                                            {isMounted ? <Select
                                                options={Object.keys(markLongName).map(value => ({ value, label: markLongName[value] }))}
                                                multi
                                                searchable={false}
                                                placeholder='フラグ'
                                                value={this.state.flags}
                                                onChange={(value: Array<{ value: MarkType }>) => this.changeFlag(value)} /> : null}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>チャンネル</label>
                                        <div>
                                            {isMounted ? <Select
                                                options={[]}
                                                multi /> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-8'>
                                    <div className='row'>
                                        <div className='col-sm-6'>
                                            <label>開始日時</label>
                                            {isMounted ? <Datetime /> : null}
                                        </div>
                                        <div className='col-sm-6'>
                                            <label>終了日時</label>
                                            {isMounted ? <Datetime /> : null}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>ソート</label>
                                                <div>
                                                    <select className='form-control'>
                                                        <option>関連度</option>
                                                        <optgroup label='タイトル'>
                                                            <option>昇順</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}