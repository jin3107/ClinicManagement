/**
 * @typedef {Object} SearchRequest
 * @property {Array} filters - Array of Filter objects
 * @property {Object} sortBy - SortByInfo object
 * @property {number} pageIndex - Page index (1-based, matches backend SearchRequest.PageIndex convention)
 * @property {number} pageSize - Page size
 */

export const createSearchRequest = (
	filters = null,
	sortBy = null,
	pageIndex = 1,
	pageSize = 100
) => ({
	filters,
	sortBy,
	pageIndex,
	pageSize,
});
