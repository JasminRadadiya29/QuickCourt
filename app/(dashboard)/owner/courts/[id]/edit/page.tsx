'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import DashboardLayout from 'app/(dashboard)/components/DashboardLayout';

type Props = {
  params: {
    id: string;
  };
};

export default function OwnerCourtEditPage({ params }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [facilities, setFacilities] = useState([]);
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?._id) return;
        
        // Fetch court details
        const courtResponse = await apiFetch(`/api/courts/${params.id}`);
        if (courtResponse) {
          // Format the data for the form
          setFormData({
            venue: courtResponse.venue,
            name: courtResponse.name,
            sport: courtResponse.sport,
            pricePerHour: courtResponse.pricePerHour,
            openHour: courtResponse.openHour || '06:00',
            closeHour: courtResponse.closeHour || '22:00',
            isAvailable: courtResponse.isAvailable !== false,
            features: courtResponse.features || []
          });
        }
        
        // Fetch facilities owned by the user
        const facilitiesResponse = await apiFetch(`/api/facilities?owner=${user._id}`);
        if (facilitiesResponse?.data) {
          setFacilities(facilitiesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load court details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, params.id]);

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
    setSubmitting(true);
    setError('');
    
    try {
      if (!formData.venue) {
        throw new Error('Please select a facility');
      }
      
      const response = await apiFetch(`/api/courts/${params.id}`, {
        method: 'PUT',
        body: formData
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/owner/courts');
      }, 2000);
    } catch (err) {
      console.error('Error updating court:', err);
      setError(err.error || 'Failed to update court. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <DashboardLayout>
        <main className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

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
        <h1 className="text-2xl font-semibold">Edit Court</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md text-error">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-md text-success">
          Court updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
        {/* Facility Selection */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium mb-1">Facility</label>
          <select
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded-md bg-background"
            required
            disabled={submitting}
          >
            <option value="">Select a facility</option>
            {facilities.map((facility) => (
              <option key={facility._id} value={facility._id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        {/* Court Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Court Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="e.g. Court A, Tennis Court 1"
            required
            disabled={submitting}
          />
        </div>

        {/* Sport Type */}
        <div>
          <label htmlFor="sport" className="block text-sm font-medium mb-1">Sport</label>
          <select
            id="sport"
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded-md bg-background"
            required
            disabled={submitting}
          >
            <option value="">Select a sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        {/* Price Per Hour */}
        <div>
          <label htmlFor="pricePerHour" className="block text-sm font-medium mb-1">Price Per Hour (₹)</label>
          <input
            type="number"
            id="pricePerHour"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleNumberChange}
            className="w-full p-2 border border-border rounded-md bg-background"
            min="0"
            step="10"
            required
            disabled={submitting}
          />
        </div>

        {/* Operating Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="openHour" className="block text-sm font-medium mb-1">Opening Time</label>
            <input
              type="time"
              id="openHour"
              name="openHour"
              value={formData.openHour}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded-md bg-background"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="closeHour" className="block text-sm font-medium mb-1">Closing Time</label>
            <input
              type="time"
              id="closeHour"
              name="closeHour"
              value={formData.closeHour}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded-md bg-background"
              required
              disabled={submitting}
            />
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
            disabled={submitting}
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm">
            Court is available for booking
          </label>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-muted px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span>{feature}</span>
                <button 
                  type="button" 
                  onClick={() => removeFeature(feature)}
                  className="ml-2 text-muted-foreground hover:text-error"
                  disabled={submitting}
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 p-2 border border-border rounded-l-md bg-background"
              placeholder="e.g. Lighting, Professional Surface"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
              disabled={!newFeature.trim() || submitting}
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
            loading={submitting}
          >
            Update Court
          </Button>
        </div>
      </form>
    </main>
  </DashboardLayout>
  );
}