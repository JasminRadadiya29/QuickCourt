'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';
import DashboardLayout from '../../../components/DashboardLayout';
import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR and suspense
const MapClient = dynamic(
  () => import('./map-client'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">Loading map...</div>
  }
);

export default function OwnerFacilityAddPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    description: '',
    address: '',
    sports: [],
    amenities: [],
    photos: [],
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  const [newSport, setNewSport] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [mapLocation, setMapLocation] = useState({ lat: 0, lng: 0 });
  const [photoUrls, setPhotoUrls] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (lat, lng) => {
    setMapLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }));
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingPhoto(true);
    try {
      // Process files to get both URL for preview and base64 for storage
      const processedPhotos = await Promise.all(Array.from(files).map(async (file) => {
        // Create URL for preview
        const previewUrl = URL.createObjectURL(file);
        
        // Convert file to base64 for MongoDB storage
        const base64Data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        
        return {
          previewUrl,
          data: base64Data,
          contentType: file.type
        };
      }));
      
      // Update preview URLs for UI display
      const newUrls = processedPhotos.map(photo => photo.previewUrl);
      setPhotoUrls(prev => [...prev, ...newUrls]);
      
      // Update form data with the processed photos for MongoDB storage
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...processedPhotos.map(photo => ({
          data: photo.data,
          contentType: photo.contentType
        }))]
      }));
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError('Failed to upload photos. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
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
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Facility Name is required');
      setLoading(false);
      return;
    }
    
    if (!formData.address.trim()) {
      setError('Full Address is required');
      setLoading(false);
      return;
    }
    
    if (formData.sports.length === 0) {
      setError('At least one sport must be added');
      setLoading(false);
      return;
    }
    
    if (formData.amenities.length === 0) {
      setError('At least one amenity must be added');
      setLoading(false);
      return;
    }
    
    if (formData.photos.length === 0) {
      setError('At least one photo must be uploaded');
      setLoading(false);
      return;
    }
    
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      setError('Please select a location on the map');
      setLoading(false);
      return;
    }
    
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
    <DashboardLayout>
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
            

          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-medium">Sports & Amenities</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sports Available *</label>
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
              <label className="block text-sm font-medium mb-1">Amenities *</label>
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

          <div className="bg-card border border-border rounded-lg p-6 shadow-soft space-y-4">
            <h2 className="text-lg font-medium">Photos & Location</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Photos of Facility *</label>
              <div className="flex items-center mb-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="flex-1 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required={formData.photos.length === 0}
                />
                {uploadingPhoto && <Icon name="Loader" size={20} className="ml-2 animate-spin" />}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Facility photo ${index + 1}`} 
                      className="w-24 h-24 object-cover rounded-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {formData.photos.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">Please upload at least one photo of your facility</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location on Map *</label>
              <div className="border border-border rounded-md h-64 mb-2 relative">
                <MapClient location={mapLocation} onLocationChange={handleLocationChange} />
              </div>
              <div className="flex gap-2 mb-2">
                <input 
                  type="number" 
                  placeholder="Latitude" 
                  value={mapLocation.lat} 
                  onChange={(e) => handleLocationChange(parseFloat(e.target.value) || 0, mapLocation.lng)}
                  className="p-2 border border-border rounded-md w-full"
                  step="0.000001"
                  required
                />
                <input 
                  type="number" 
                  placeholder="Longitude" 
                  value={mapLocation.lng} 
                  onChange={(e) => handleLocationChange(mapLocation.lat, parseFloat(e.target.value) || 0)}
                  className="p-2 border border-border rounded-md w-full"
                  step="0.000001"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">Click on the map to select location or enter coordinates manually</p>
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
    </DashboardLayout>
  );
}
