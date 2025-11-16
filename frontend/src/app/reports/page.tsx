'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reportAPINew } from '@/lib/api';

interface FlexibleMedication {
  name?: string;
  dosage?: string;
  duration?: string;
  description?: string;
}

interface ReportAnalysisResponse {
  diagnosis: string;
  medications: (string | FlexibleMedication)[];
  prescription: string[];
  specialist: string;
  dietary_suggestions: string[];
  disclaimer: string;
}
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReportAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    setAnalysisResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await reportAPINew.uploadReport(selectedFile);
      console.log('Backend response:', response.data);
      
      // Handle flexible medication format from backend
      const processedData: ReportAnalysisResponse = {
        ...response.data,
        medications: response.data.medications || []
      };
      setAnalysisResult(processedData);
    } catch (error: unknown) {
      console.error('Report analysis error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to analyze report'
        : 'An error occurred while analyzing the report';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Medical Report Analysis</h1>
          <p className="text-xl text-purple-700 max-w-3xl mx-auto">
            Upload your PDF medical reports to get AI-powered analysis, diagnosis insights, and treatment recommendations
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
            <Upload className="h-6 w-6 mr-3 text-purple-600" />
            Upload Medical Report
          </h2>
          
          <div className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-purple-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drop your PDF report here, or{' '}
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700 underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports PDF files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAnalyzeReport}
                disabled={!selectedFile || loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Analyze Report
                  </>
                )}
              </Button>
              
              {selectedFile && (
                <Button
                  variant="outline"
                  onClick={removeFile}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Remove File
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-3" />
              Report Analysis Results
            </h3>
            
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Diagnosis</h4>
                <p className="text-blue-700 leading-relaxed">
                  {analysisResult.diagnosis || "No diagnosis information available."}
                </p>
              </div>
              
              {/* Medications */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">Recommended Medications</h4>
                {analysisResult.medications && analysisResult.medications.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysisResult.medications.map((med, index) => {
                      // Handle different medication formats
                      let medName = '';
                      const medDetails: string[] = [];
                      
                      if (typeof med === 'string') {
                        medName = med;
                      } else if (typeof med === 'object' && med) {
                        medName = med.name || `Medication ${index + 1}`;
                        
                        if (med.dosage) medDetails.push(`Dosage: ${med.dosage}`);
                        if (med.duration) medDetails.push(`Duration: ${med.duration}`);
                        if (med.description) medDetails.push(med.description);
                      }
                      
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                          <h5 className="font-medium text-purple-900 mb-2">{medName}</h5>
                          {medDetails.length > 0 && (
                            <div className="space-y-1">
                              {medDetails.map((detail, detailIndex) => (
                                <p key={detailIndex} className="text-sm text-purple-700">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-purple-600 italic">No medications specified in the analysis.</p>
                )}
              </div>
              
              {/* Specialist Consultation */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-orange-800 mb-3">Specialist Consultation</h4>
                <p className="text-orange-700 leading-relaxed">
                  {analysisResult.specialist || "No specialist consultation recommendation available."}
                </p>
              </div>
              
              {/* Dietary Suggestions */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4">Dietary Suggestions</h4>
                {analysisResult.dietary_suggestions && analysisResult.dietary_suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {analysisResult.dietary_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-green-700">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 italic">No dietary suggestions available.</p>
                )}
              </div>
              
              {/* Prescription */}
              {analysisResult.prescription && analysisResult.prescription.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-4">Prescription Details</h4>
                  <ul className="space-y-2">
                    {analysisResult.prescription.map((item, index) => (
                      <li key={index} className="flex items-start text-indigo-700">
                        <span className="text-indigo-500 mr-2 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-yellow-800 flex items-center mb-3">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Important Disclaimer
                </h4>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  {analysisResult.disclaimer || "This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment."}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Print Results
              </Button>
              <Button
                onClick={() => setAnalysisResult(null)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Clear Results
              </Button>
            </div>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-8 p-6 bg-white/60 backdrop-blur-sm shadow-lg border-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">1. Upload Report</h4>
              <p className="text-gray-600">Upload your medical report in PDF format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Loader2 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">2. AI Analysis</h4>
              <p className="text-gray-600">Our AI analyzes your report using advanced medical knowledge</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">3. Get Insights</h4>
              <p className="text-gray-600">Receive detailed analysis and recommendations</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
