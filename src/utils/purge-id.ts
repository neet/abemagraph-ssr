export const purgeId = <T>(obj: T): T => {
    delete obj['_id'];
    return obj;
};