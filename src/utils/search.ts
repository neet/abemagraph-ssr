import { parse } from 'search-query-parser';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ParsedQuery } from '../types/abemagraph';
import { sortType, SortType, markName } from '../views/constant/const';

export function validateAndParseSearch(query: string): [string[], ParsedQuery] {
    const parsed = parse(query, { keywords: ['channel', 'flag', 'since', 'until', 'sort', 'group', 'series'] });

    if (typeof parsed === 'string') {
        return [[], {
            keyword: parsed,
            channel: [],
            series: [],
            group: [],
            flag: []
        }];
    } else {
        const errors: string[] = [];
        const search: ParsedQuery = {
            keyword: (parsed.text || '').trim(),
            channel: _.flatMap([parsed.channel || []], m => m as string),
            series: _.flatMap([parsed.series || []], m => m as string),
            group: _.flatMap([parsed.group || []], m => m as string),
            flag: []
        };
        if (parsed.sort) {
            if (typeof parsed.sort !== 'string') {
                errors.push('ソート指定は一種類のみです');
            } else if (!sortType[parsed.sort]) {
                errors.push(`ソート種別が不正です: ${parsed.sort}`);
            } else {
                search.sort = parsed.sort as SortType;
            }
        }
        const flags = _.flatMap([parsed.flag || []], m => m as string);
        search.flag = flags.filter(flag => !!markName[flag]);
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
                else {
                    if (parsed.until === 'now')
                        search.until = ['now', moment()];
                    else
                        errors.push('終了時間指定が不正です');
                }
            }
        }
        if (parsed.since) {
            if (typeof parsed.since !== 'string') {
                errors.push('開始時間指定は複数できません');
            } else {
                const since = moment(parsed.since);
                if (since.isValid())
                    search.since = [parsed.since, since];
                else {
                    if (parsed.since === 'now')
                        search.since = ['now', moment()];
                    else
                        errors.push('開始時間指定が不正です');
                }
            }
        }
        return [errors, search];
    }
}