'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import { Search, Stethoscope, Pill, AlertCircle, CheckCircle } from 'lucide-react';
import { diagnosisAPINew, medicineAPI } from '@/lib/api';

interface DiagnosisResponse {
  diagnosis: string;
  medications: Array<{
    name: string;
    description: string;
  }>;
  prescription: string[];
  specialist: string;
  dietary_suggestions: string[];
  disclaimer: string;
}

interface Medicine {
  _id: string;
  srNo: number;
  drugCode: string;
  genericName: string;
  unitSize: string;
  mrp: number;
  __v: number;
}

export default function DiagnosisPage() {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState('');

  const [prescription, setPrescription] = useState('');
  const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [medicineError, setMedicineError] = useState('');
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'medicine'>('diagnosis');

  const handleDiagnosis = async () => {
    if (!symptoms.trim()) {
      setDiagnosisError('Please enter symptoms');
      return;
    }

    setDiagnosisLoading(true);
    setDiagnosisError('');
    
    try {
      const response = await diagnosisAPINew.getDiagnosis({ symptoms });
      setDiagnosisResult(response.data);
    } catch (error: unknown) {
      console.error('Diagnosis error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to get diagnosis'
        : 'An error occurred';
      setDiagnosisError(errorMessage);
    } finally {
      setDiagnosisLoading(false);
    }
  };

  const handleMedicineSearch = async () => {
    if (!prescription.trim()) {
      setMedicineError('Please enter medicine names');
      return;
    }

    setMedicineLoading(true);
    setMedicineError('');
    
    try {
      const prescriptionArray = prescription.split(',').map(med => med.trim()).filter(med => med);
      const response = await medicineAPI.searchByPrescription(prescriptionArray);
      setMedicineResults(response.data.data || response.data);
    } catch (error: unknown) {
      console.error('Medicine search error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to search medicines'
        : 'An error occurred';
      setMedicineError(errorMessage);
    } finally {
      setMedicineLoading(false);
    }
  };

  const handleGetAllMedicines = async () => {
    setMedicineLoading(true);
    setMedicineError('');
    
    try {
      const response = await medicineAPI.getAll();
      setAllMedicines(response.data.data || response.data);
    } catch (error: unknown) {
      console.error('Get all medicines error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to fetch medicines'
        : 'An error occurred';
      setMedicineError(errorMessage);
    } finally {
      setMedicineLoading(false);
    }
  };

  const handleGetDiagnosisMedicines = async () => {
    if (!diagnosisResult) {
      setMedicineError('Please get diagnosis first');
      return;
    }

    setMedicineLoading(true);
    setMedicineError('');
    
    try {
      // Extract medicine names from diagnosis result
      const medicineNames = diagnosisResult.medications.map(med => med.name);
      if (medicineNames.length === 0) {
        setMedicineError('No medicines found in diagnosis');
        return;
      }
      
      const response = await medicineAPI.searchByPrescription(medicineNames);
      setMedicineResults(response.data.data || response.data);
      
      // Switch to medicine tab to show results
      setActiveTab('medicine');
    } catch (error: unknown) {
      console.error('Get diagnosis medicines error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to search medicines'
        : 'An error occurred';
      setMedicineError(errorMessage);
    } finally {
      setMedicineLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-black">Medical Diagnosis & Medicine Search</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8">
            <Button
              variant={activeTab === 'diagnosis' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('diagnosis')}
              className={`flex items-center space-x-2 ${activeTab === 'diagnosis' ? 'bg-purple-900 hover:bg-purple-800' : ''}`}
            >
              <Stethoscope className="h-4 w-4" />
              <span>Diagnosis</span>
            </Button>
            <Button
              variant={activeTab === 'medicine' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('medicine')}
              className={`flex items-center space-x-2 ${activeTab === 'medicine' ? 'bg-purple-900 hover:bg-purple-800' : ''}`}
            >
              <Pill className="h-4 w-4" />
              <span>Medicine Search</span>
            </Button>
          </div>

          {/* Diagnosis Tab */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                  Symptom Analysis
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Describe your symptoms:
                    </label>
                    <Textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Enter your symptoms in detail (e.g., headache, fever, cough, fatigue...)"
                      className="min-h-[120px] text-black"
                    />
                  </div>
                  
                  {diagnosisError && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{diagnosisError}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDiagnosis}
                      disabled={diagnosisLoading}
                      className="bg-purple-900 hover:bg-purple-800"
                    >
                      {diagnosisLoading ? 'Analyzing...' : 'Get Diagnosis'}
                    </Button>
                    
                    <Button
                      onClick={handleGetDiagnosisMedicines}
                      disabled={!diagnosisResult || medicineLoading}
                      variant="outline"
                      className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
                    >
                      <Pill className="h-4 w-4 mr-2" />
                      {medicineLoading ? 'Searching...' : 'Get Medicines'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Diagnosis Results */}
              {diagnosisResult && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Diagnosis Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Diagnosis:</h4>
                      <p className="text-gray-900">{diagnosisResult.diagnosis}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700">Recommended Medications:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnosisResult.medications.map((med, index) => (
                          <li key={index} className="text-gray-900">
                            <strong>{med.name}:</strong> {med.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700">Specialist Consultation:</h4>
                      <p className="text-gray-900">{diagnosisResult.specialist}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700">Dietary Suggestions:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnosisResult.dietary_suggestions.map((suggestion, index) => (
                          <li key={index} className="text-gray-900">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Important Disclaimer:
                      </h4>
                      <p className="text-yellow-700 text-sm mt-1">{diagnosisResult.disclaimer}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Medicine Tab */}
          {activeTab === 'medicine' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <Pill className="h-5 w-5 mr-2 text-purple-600" />
                  Medicine Search
                </h2>
                
                <div className="space-y-4">
                  <div>
                    
                    <Textarea
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Enter medicine names separated by commas (e.g., Paracetamol, Ibuprofen, Amoxicillin)"
                      className="min-h-[80px] text-black"
                    />
                  </div>
                  
                  {medicineError && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{medicineError}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleMedicineSearch}
                      disabled={medicineLoading}
                      className="flex items-center space-x-2 bg-purple-900 hover:bg-purple-800"
                    >
                      <Search className="h-4 w-4" />
                      <span>{medicineLoading ? 'Searching...' : 'Search Medicines'}</span>
                    </Button>
                    
                    <Button
                      onClick={handleGetAllMedicines}
                      disabled={medicineLoading}
                      variant="outline"
                      className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
                    >
                      {medicineLoading ? 'Loading...' : 'View All Medicines'}
                    </Button>
                  </div>
                </div>
              </Card>

  

              {/* Medicine Search Results */}
              {medicineResults.length > 0 && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Search Results ({medicineResults.length} found)</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {medicineResults.map((medicine) => (
                      <Card key={medicine._id} className="p-4 border-l-4 border-l-blue-500 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <h4 className="font-semibold text-purple-900">{medicine.genericName}</h4>

                        <p className="text-sm text-gray-900 mt-1">
                          <strong>Unit Size:</strong> {medicine.unitSize}
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Serial No:</strong> {medicine.srNo}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          ₹{medicine.mrp}
                        </p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* All Medicines */}
              {allMedicines.length > 0 && (
                <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">All Available Medicines ({allMedicines.length} found)</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {allMedicines.map((medicine) => (
                      <Card key={medicine._id} className="p-4 border-l-4 border-l-green-500 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <h4 className="font-semibold text-green-900">{medicine.genericName}</h4>
                        <p className="text-sm text-gray-600 mt-1">Drug Code: {medicine.drugCode}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Unit Size:</strong> {medicine.unitSize}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Serial No:</strong> {medicine.srNo}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          ₹{medicine.mrp}
                        </p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
