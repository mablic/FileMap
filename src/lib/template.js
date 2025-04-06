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
    data: []
  };

  // Process each row of data after the header
  for (let i = dataStartIndex; i < excelData.length; i++) {
    const row = excelData[i];
    const processedRow = template.data.map(mapping => {
      // Convert column letter to index using the new function
      const columnIndex = getColumnIndex(mapping.value);
      return row[columnIndex];
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
