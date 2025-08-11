'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';

export default function OwnerFacilityAddPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    locationShort: '',
    sports: [],
    amenities: [],
    startingPrice: 0,
    photos: []
  });

  const [newSport, setNewSport] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

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

  const addSport = () => {
    if (newSport.trim() && !formData.sports.includes(newSport.trim())) {
      setFormData(prev => ({
        ...prev,
        sports: [...prev.sports, newSport.trim()]
      }));
      setNewSport('');
    }
  };

  const removeSport = (sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.filter(s => s !== sport)
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Current user:', user);
      
      if (!user?._id) {
        console.error('User not authenticated or missing _id');
        throw new Error('User not authenticated');
      }
      
      const facilityData = {
        ...formData,
        owner: user._id
      };
      
      console.log('Sending facility data:', facilityData);
      
      const response = await apiFetch('/api/facilities', {
        method: 'POST',
        body: facilityData
      });
      
      console.log('API response:', response);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/owner/facilities');
      }, 2000);
    } catch (err) {
      console.error('Error creating facility:', err);
      setError(err.error || 'Failed to create facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Add New Facility</h1>
      </div>

      {success ? (
        <div className="bg-success/10 border border-success/30 text-success p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <Icon name="CheckCircle" className="mr-2" />
            <p>Facility created successfully! Redirecting...</p>
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

          <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-medium">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Facility Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Downtown Tennis Club"
                />
              </div>
              
              <div>
                <label htmlFor="startingPrice" className="block text-sm font-medium mb-1">Starting Price (per hour) *</label>
                <input
                  id="startingPrice"
                  name="startingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.startingPrice}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Describe your facility..."
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-medium">Location</h2>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Full Address *</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Street address, City, State, Zip"
              />
            </div>
            
            <div>
              <label htmlFor="locationShort" className="block text-sm font-medium mb-1">Short Location</label>
              <input
                id="locationShort"
                name="locationShort"
                type="text"
                value={formData.locationShort}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Downtown, West Side"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-medium">Sports & Amenities</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sports Available</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value)}
                  className="flex-1 p-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Tennis, Basketball"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSport())}
                />
                <button
                  type="button"
                  onClick={addSport}
                  className="p-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
                >
                  <Icon name="Plus" size={20} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sports.map((sport, index) => (
                  <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                    <span className="text-sm">{sport}</span>
                    <button
                      type="button"
                      onClick={() => removeSport(sport)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amenities</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 p-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Parking, Showers"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="p-2 bg-primary text-white rounded-r-md hover:bg-primary/90"
                >
                  <Icon name="Plus" size={20} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
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
              Create Facility
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
