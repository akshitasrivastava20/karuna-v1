'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  rating: number;
  location: string; // This is a Google Maps URL string from the backend
  contact?: string;
  website?: string;
  // Additional fields for frontend functionality (with defaults)
  experience?: number;
  availability?: string;
  consultationFee?: number;
  image?: string;
  distance?: number; // Added for dynamic distance calculation
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  // Note: Distance calculation removed as backend doesn't provide coordinates

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://karuna-backend-wbeh.onrender.com/api/data/docs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter and sort doctors
  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization = selectedSpecialization === '' || 
                                  doctor.specialization === selectedSpecialization;
      
      return matchesSearch && matchesSpecialization;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialization, sortBy]);

  // Get unique specializations
  const specializations = Array.from(new Set(doctors.map(doctor => doctor.specialization))).sort();

  const handleBookConsultation = (doctorId: string) => {
    // Navigate to booking page or open modal
    alert(`Booking consultation with doctor ID: ${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Find Your Doctor</h1>
          <p className="text-xl text-purple-700 max-w-2xl mx-auto">
            Connect with experienced healthcare professionals in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Search Doctors
              </label>
              <input
                type="text"
                placeholder="Search by name or specialization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-purple-600">
                <span className="font-medium">{filteredDoctors.length}</span> doctors found
              </div>
            </div>
          </div>


        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Doctor Image */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={300}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">{doctor.name}</h3>
                <p className="text-purple-700 font-medium mb-4">{doctor.specialization}</p>

                {/* Rating and Distance */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-purple-600">{doctor.rating}</span>
                  </div>

                </div>

                {/* Contact Info */}
                {doctor.contact && (
                  <p className="text-sm text-gray-600 mb-2">📞 {doctor.contact}</p>
                )}
                {doctor.website && (
                  <p className="text-sm text-purple-600 mb-4">
                    <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      🌐 Visit Website
                    </a>
                  </p>
                )}

                {/* Rating Display */}
                <div className="flex justify-center items-center mb-4">
                  <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    ⭐ {doctor.rating} rating
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleBookConsultation(doctor._id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Book Consultation
                  </Button>
                  {doctor.location && (
                    <Button
                      variant="outline"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                      onClick={() => window.open(doctor.location, '_blank')}
                    >
                      View on Maps
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">No doctors found</h3>
            <p className="text-purple-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
