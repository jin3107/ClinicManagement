/**
 * @typedef {Object} SearchResponse
 * @property {Array} data - Array of items
 * @property {number} currentPage - Current page number
 * @property {number} totalPages - Total number of pages
 * @property {number} rowsPerPage - Rows per page
 * @property {number} totalRows - Total number of rows
 */

export const createSearchResponse = (
	data = [],
	currentPage = 0,
	totalPages = 0,
	rowsPerPage = 0,
	totalRows = 0
) => ({
	data,
	currentPage,
	totalPages,
	rowsPerPage,
	totalRows,
});
