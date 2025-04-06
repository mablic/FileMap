import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Preview from './review/preview';
import Review from './review/review';
import templateData from '../template/template.json';
import { readExcelFile } from '../lib/excel';
import { processTemplate, getTemplateByName } from '../lib/template';

const Home = () => {
  const [previewData, setPreviewData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      setIsLoading(true);
      const file = acceptedFiles[0];
      const jsonData = await readExcelFile(file);
      setPreviewData(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    }
  });

  const handleCancel = () => {
    setPreviewData(null);
    setSelectedTemplate('');
    setIsReviewMode(false);
    setProcessedData(null);
  };

  const handleNextStep = async () => {
    setIsProcessing(true);
    try {
      const template = getTemplateByName(templateData.template, selectedTemplate);
      if (template && previewData) {
        const processed = processTemplate(previewData, template);
        setProcessedData(processed);
        setIsReviewMode(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevStep = () => {
    setIsReviewMode(false);
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-[spin_0.8s_linear_infinite] border-t-transparent"></div>
          </div>
          <p className="text-lg text-gray-600">Loading Excel file...</p>
        </div>
      </div>
    );
  }

  if (previewData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="w-11/12 mx-auto">
          {!isReviewMode ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Select Template:</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a template...</option>
                    {templateData.template.map((template, index) => (
                      <option key={index} value={template.name}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedTemplate || isProcessing}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center gap-2 ${
                      selectedTemplate && !isProcessing
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-300 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing && (
                      <div className="relative w-4 h-4">
                        <div className="absolute top-0 left-0 w-full h-full border-2 border-white/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-2 border-white rounded-full animate-[spin_0.8s_linear_infinite] border-t-transparent"></div>
                      </div>
                    )}
                    {isProcessing ? 'Processing...' : 'Next Step'}
                  </button>
                </div>
              </div>
              <Preview data={previewData} />
            </>
          ) : (
            <Review 
              data={processedData}
              onPrevStep={handlePrevStep}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-blue-600 rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive ? 'bg-blue-50' : 'bg-white hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg text-gray-600">
              {isDragActive
                ? "Drop the file here..."
                : "Drag and drop an Excel or CSV file here, or click to select"}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: .xlsx, .csv
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;