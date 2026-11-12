/**
 * @typedef {Object} SortByInfo
 * @property {string} fieldName - Field name to sort by
 * @property {boolean} ascending - Sort in ascending order (default: true)
 */

export const createSortByInfo = (fieldName = '', ascending = true) => ({
	fieldName,
	ascending,
});
