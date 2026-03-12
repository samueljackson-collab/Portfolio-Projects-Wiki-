/**
 * Fuzzy-matches a query string against a text string.
 * Returns true if all characters of query appear in text in order (case-insensitive).
 * Returns true when query is empty.
 */
export const fuzzyMatch = (query: string, text: string): boolean => {
    if (!query) return true;
    query = query.toLowerCase();
    text = text.toLowerCase();
    let queryIndex = 0;
    let textIndex = 0;
    while (queryIndex < query.length && textIndex < text.length) {
        if (query[queryIndex] === text[textIndex]) {
            queryIndex++;
        }
        textIndex++;
    }
    return queryIndex === query.length;
};
