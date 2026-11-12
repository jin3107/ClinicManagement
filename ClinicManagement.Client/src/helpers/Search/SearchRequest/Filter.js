/**
 * @typedef {Object} Filter
 * @property {string} fieldName - Field name to filter
 * @property {string} value - Filter value
 * @property {string} operation - Filter operation (e.g., 'eq', 'contains', 'gt', 'lt')
 */

export const createFilter = (fieldName = '', value = '', operation = null) => ({
	fieldName,
	value,
	operation,
});
