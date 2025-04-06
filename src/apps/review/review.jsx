import React from 'react';
import Button from '../components/buttom';
import { exportToExcel } from '../../lib/excel';
import { getExcelColumnName } from '../../lib/template';

const Review = ({ data, onPrevStep, onCancel }) => {
  const handleExport = () => {
    if (data) {
      exportToExcel(data, 'processed_data.xlsx');
    }
  };

  if (!data) {
    return null;
  }

  // Function to get cell class based on type
  const getCellClass = (type) => {
    const baseClass = "w-[200px] px-2 py-2 text-sm text-gray-500 border-r border-b border-gray-200";
    switch (type) {
      case 'number':
        return `${baseClass} text-right font-mono`;
      case 'date':
        return `${baseClass} text-center font-mono`;
      default:
        return `${baseClass}`;
    }
  };

  // Function to split text into lines while preserving words
  const formatHeaderText = (text) => {
    // Split by spaces and line breaks
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = [];
    let currentLength = 0;
    
    // Group words into lines of similar length
    words.forEach(word => {
      if (currentLength + word.length > 10) {
        lines.push(currentLine.join(' '));
        currentLine = [word];
        currentLength = word.length;
      } else {
        currentLine.push(word);
        currentLength += word.length + 1;
      }
    });
    
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }
    
    return lines;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Review Processed Data
        </h2>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onPrevStep}>
            Previous Step
          </Button>
          <Button onClick={handleExport}>
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md w-full h-[calc(100vh-280px)]">
        <div className="overflow-x-auto overflow-y-auto h-full relative">
          <table className="border-collapse border-2 border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-300 sticky left-0 top-0 bg-gray-50 z-50 shadow-[2px_2px_2px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:left-0 before:top-[-1px] before:w-full before:h-[1px] before:bg-gray-50">
                  #
                </th>
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="w-[200px] px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-300 sticky top-0 bg-gray-50 z-40 shadow-[0_2px_2px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:left-0 before:top-[-1px] before:w-full before:h-[1px] before:bg-gray-50"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600 text-sm font-medium mb-1">{getExcelColumnName(index)}</span>
                      <div className="flex flex-col items-center w-full">
                        {formatHeaderText(header).map((line, i) => (
                          <span 
                            key={i} 
                            className="text-center text-[10px] leading-tight font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full"
                            style={{
                              fontSize: `${Math.min(10, Math.max(8, Math.floor(100 / line.length)))}px`
                            }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="w-12 px-2 py-2 text-sm font-medium text-gray-500 border-r border-gray-300 border-b border-gray-200 sticky left-0 bg-white z-30 shadow-[2px_0_2px_rgba(0,0,0,0.1)]">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={getCellClass(data.types[cellIndex])}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {cell}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Review;
