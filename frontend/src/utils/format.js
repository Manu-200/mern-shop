/**
 * Formats a number into the INR currency format (e.g., ₹8,000).
 * @param {number} price The price to format.
 * @returns {string} The formatted currency string.
 */
export const fmt = (price) => {
  if (price === undefined || price === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formats a date string into a more readable format (e.g., 13 May 2026).
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted date string.
 */
export const fmtDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Returns a text color based on order status.
 * @param {string} status The order status.
 * @returns {string} A CSS color variable.
 */
export const statusColor = (status) => ({
  processing: 'var(--orange)',
  confirmed: 'var(--blue)',
  shipped: 'var(--blue)',
  delivered: 'var(--green)',
  cancelled: 'var(--red)',
}[status] || 'var(--ink-faint)');

/**
 * Returns a background color based on order status.
 * @param {string} status The order status.
 * @returns {string} A CSS color variable.
 */
export const statusBg = (status) => ({
  processing: 'var(--orange-bg)',
  confirmed: 'var(--blue-bg)',
  shipped: 'var(--blue-bg)',
  delivered: 'var(--green-bg)',
  cancelled: 'var(--red-bg)',
}[status] || 'var(--stone)');
