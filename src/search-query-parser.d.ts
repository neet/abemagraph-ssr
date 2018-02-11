declare module 'search-query-parser' {
    type Options = {
        keywords?: string[];
        ranges?: string[];
    };
    type Result = {
        text: string;
        offsets: Array<{
            offsetStart: number;
            offsetEnd: number;
        } & ({
            text: string;
        } | {
                keyword: string;
                value: string;
            })>;
        [key: string]: {
            from?: string;
            to?: string;
        } | string[] | string | {};
    }
    function parse(query: string, options?: Options): Result;
}