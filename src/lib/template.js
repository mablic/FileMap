/**
 * Converts a column index to Excel column letters (A, B, ..., Z, AA, AB, etc.)
 * @param {number} index - Zero-based column index
 * @returns {string} - Excel column letters
 */
export const getExcelColumnName = (index) => {
  let columnName = '';
  let num = index;
  
  while (num >= 0) {
    const remainder = num % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    num = Math.floor(num / 26) - 1;
  }
  
  return columnName;
};

/**
 * Converts Excel column letter to index (e.g., 'A' -> 0, 'Z' -> 25, 'AA' -> 26)
 * @param {string} column - Excel column letter (A-Z, AA-ZZ, etc.)
 * @returns {number} - Zero-based column index
 */
export const getColumnIndex = (column) => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result *= 26;
    result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return result - 1;
};

/**
 * Converts Excel serial number to Date object
 * @param {number} serial - Excel date serial number
 * @returns {Date} JavaScript Date object
 */
const excelSerialToDate = (serial) => {
  // Excel's epoch starts from 1900-01-01
  const epoch = new Date(1900, 0, 1);
  // Adjust for Excel's leap year bug (1900 is not a leap year)
  const daysOffset = serial > 59 ? 1 : 0;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return new Date(epoch.getTime() + (serial - daysOffset) * millisecondsPerDay);
};

/**
 * Checks if a string matches common date formats
 * @param {string} str - String to check
 * @returns {boolean} True if string matches date format
 */
const isDateString = (str) => {
  if (typeof str !== 'string') return false;
  // Common date formats: m/d/yy, mm/dd/yyyy, yyyy-mm-dd, etc.
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{2}(?:\d{2})?$/,  // m/d/yy or m/d/yyyy
    /^\d{4}-\d{1,2}-\d{1,2}$/,               // yyyy-mm-dd
    /^\d{1,2}-\d{1,2}-\d{2}(?:\d{2})?$/,     // d-m-yy or d-m-yyyy
    /^\d{1,2}\.\d{1,2}\.\d{2}(?:\d{2})?$/    // d.m.yy or d.m.yyyy
  ];
  return datePatterns.some(pattern => pattern.test(str));
};

/**
 * Formats a value based on its type
 * @param {any} value - The value to format
 * @param {string} type - The type of the value (string, number, date)
 * @returns {string} - Formatted value
 */
const formatValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  switch (type) {
    case 'date':
      try {
        // Handle numeric Excel dates
        if (typeof value === 'number' || (!isNaN(value) && !isDateString(String(value)))) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            const date = excelSerialToDate(numValue);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              });
            }
          }
        }

        // Handle date strings
        const strValue = String(value);
        if (isDateString(strValue)) {
          // Try to parse the date string
          let date;
          if (strValue.includes('/')) {
            const [month, day, year] = strValue.split('/');
            date = new Date(
              year.length === 2 ? '20' + year : year,
              parseInt(month) - 1,
              day
            );
          } else if (strValue.includes('-')) {
            date = new Date(strValue);
          } else if (strValue.includes('.')) {
            const [day, month, year] = strValue.split('.');
            date = new Date(
              year.length === 2 ? '20' + year : year,
              parseInt(month) - 1,
              day
            );
          }

          if (date && !isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            });
          }
        }

        // If all else fails, try standard date parsing
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
        }
        return value; // Return original if all parsing attempts fail
      } catch (e) {
        return value;
      }
    case 'number':
      try {
        const num = parseFloat(value);
        if (isNaN(num)) {
          return value;
        }
        return num.toFixed(2);
      } catch (e) {
        return value;
      }
    default:
      return String(value);
  }
};

/**
 * Processes Excel data according to a template
 * @param {Array<Array>} excelData - The raw Excel data as a 2D array
 * @param {Object} template - The template object containing mapping information
 * @returns {Object} - Processed data with headers and values
 */
export const processTemplate = (excelData, template) => {
  // Skip to the header row specified in the template
  const dataStartIndex = template.headerRow;
  
  // Initialize the result object
  const result = {
    headers: template.data.map(item => item.name),
    types: template.data.map(item => item.type), // Store types for later use
    data: []
  };

  // Process each row of data after the header
  for (let i = dataStartIndex; i < excelData.length; i++) {
    const row = excelData[i];
    const processedRow = template.data.map((mapping, index) => {
      const columnIndex = getColumnIndex(mapping.value);
      const rawValue = row[columnIndex];
      return formatValue(rawValue, mapping.type);
    });
    result.data.push(processedRow);
  }

  return result;
};

/**
 * Gets a template by name from the template collection
 * @param {Array} templates - Array of available templates
 * @param {string} templateName - Name of the template to find
 * @returns {Object|null} - The found template or null
 */
export const getTemplateByName = (templates, templateName) => {
  return templates.find(template => template.name === templateName) || null;
};
