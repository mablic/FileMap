import React from 'react';

const Preview = ({ data }) => {
  if (!data || !data[0]) return null;

  const getColumnLetter = (index) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky left-0 bg-gray-50">
                #
              </th>
              {data[0].map((header, index) => (
                <th
                  key={index}
                  className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider border-b min-w-[150px]"
                  style={{ width: `${Math.max(12.5, 100 / data[0].length)}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600 text-sm font-medium mb-1">{getColumnLetter(index)}</span>
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
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="w-12 px-2 py-2 text-sm font-medium text-gray-500 border-r sticky left-0 bg-white">
                  {rowIndex + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-2 py-2 text-sm text-gray-500"
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
  );
};

export default Preview;
