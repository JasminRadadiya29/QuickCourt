'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';

export default function OwnerCourtAddPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  
  const [formData, setFormData] = useState({
    venue: '',
    name: '',
    sport: '',
    pricePerHour: 0,
    openHour: '06:00',
    closeHour: '22:00',
    isAvailable: true,
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  // Fetch facilities owned by the current user
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (!user?._id) return;
        
        const response = await apiFetch(`/api/facilities?owner=${user._id}`);
        if (response?.data) {
          setFacilities(response.data);
          // Set the first facility as default if available
          if (response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              venue: response.data[0]._id
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching facilities:', err);
        setError('Failed to load your facilities. Please try again.');
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.venue) {
        throw new Error('Please select a facility');
      }
      
      const response = await apiFetch('/api/courts', {
        method: 'POST',
        body: formData
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/owner/facilities');
      }, 2000);
    } catch (err) {
      console.error('Error creating court:', err);
      setError(err.error || 'Failed to create court. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sports options
  const sportsOptions = [
    'Tennis',
    'Basketball',
    'Soccer',
    'Volleyball',
    'Badminton',
    'Squash',
    'Pickleball',
    'Cricket',
    'Hockey',
    'Other'
  ];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Add New Court</h1>
      </div>

      {success ? (
        <div className="bg-success/10 border border-success/30 text-success p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <Icon name="CheckCircle" className="mr-2" />
            <p>Court created successfully! Redirecting...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
              <div className="flex items-center">
                <Icon name="AlertTriangle" className="mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {loadingFacilities ? (
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : facilities.length === 0 ? (
            <div className="bg-warning/10 border border-warning/30 text-warning p-4 rounded-lg">
              <div className="flex items-center">
                <Icon name="AlertCircle" className="mr-2" />
                <div>
                  <p>You don't have any facilities yet.</p>
                  <button 
                    type="button" 
                    onClick={() => router.push('/owner/facilities/add')}
                    className="text-primary underline mt-1"
                  >
                    Create a facility first
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
              <h2 className="text-lg font-medium">Basic Information</h2>
              
              <div>
                <label htmlFor="venue" className="block text-sm font-medium mb-1">Select Facility *</label>
                <select
                  id="venue"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Court Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Court 1, Center Court"
                  />
                </div>
                
                <div>
                  <label htmlFor="sport" className="block text-sm font-medium mb-1">Sport Type *</label>
                  <select
                    id="sport"
                    name="sport"
                    required
                    value={formData.sport}
                    onChange={handleChange}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" disabled>Select a sport</option>
                    {sportsOptions.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium mb-1">Price Per Hour *</label>
                <input
                  id="pricePerHour"
                  name="pricePerHour"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.pricePerHour}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {!loadingFacilities && facilities.length > 0 && (
            <>
              <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-medium">Availability</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="openHour" className="block text-sm font-medium mb-1">Opening Time</label>
                    <input
                      id="openHour"
                      name="openHour"
                      type="time"
                      value={formData.openHour}
                      onChange={handleChange}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="closeHour" className="block text-sm font-medium mb-1">Closing Time</label>
                    <input
                      id="closeHour"
                      name="closeHour"
                      type="time"
                      value={formData.closeHour}
                      onChange={handleChange}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm">
                    Court is available for booking
                  </label>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-medium">Features</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Court Features</label>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 p-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. Lighting, Covered, Spectator Seating"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="p-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
                    >
                      <Icon name="Plus" size={20} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 text-muted-foreground hover:text-destructive"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading && <Icon name="Loader" size={16} className="mr-2 animate-spin" />}
                  Create Court
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </main>
  );
}
