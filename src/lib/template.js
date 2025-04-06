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
      // Convert column letter to index (e.g., 'C' -> 2)
      const columnIndex = mapping.value.charCodeAt(0) - 'A'.charCodeAt(0);
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
