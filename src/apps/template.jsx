import React, { useState, useEffect } from 'react';
import templateData from '../template/template.json';

const Template = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (templateData.template.length > 0) {
      setSelectedTemplate(templateData.template[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="w-11/12 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Template Tabs */}
          <div className="border-b">
            <div className="flex">
              {templateData.template.map((template, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 text-sm font-medium focus:outline-none ${
                    selectedTemplate?.name === template.name
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template Content */}
          {selectedTemplate && (
            <div className="p-6">
              <div className="space-y-6">
                {/* Template Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-gray-600 mb-2">{selectedTemplate.description}</p>
                  <p className="text-gray-600">Header starts at row {selectedTemplate.headerRow}</p>
                </div>

                {/* Column Mapping Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Column Mapping Details</h3>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                            Output Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                            Data From
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                            Column Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTemplate.data.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              Source Excel
                            </td>
                            <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                              Column {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template;
