import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'output.xlsx') => {
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
};

export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const maxCol = range.e.c;
        
        // Convert to JSON with options to preserve empty cells
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '', // Use empty string for empty cells
          blankrows: true, // Keep empty rows
          range: range // Ensure we process the full range
        });

        // Ensure all rows have the same length
        const normalizedData = jsonData.map(row => {
          const newRow = [...row];
          while (newRow.length <= maxCol) {
            newRow.push('');
          }
          return newRow;
        });

        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
