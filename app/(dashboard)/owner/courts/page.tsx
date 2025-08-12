'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import DashboardLayout from 'app/(dashboard)/components/DashboardLayout';

export default function OwnerCourtsPage() {
  const [courts, setCourts] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?._id) return;
        
        // Fetch facilities owned by the user
        const facilitiesResponse = await apiFetch(`/api/facilities?owner=${user._id}`);
        if (facilitiesResponse?.data) {
          setFacilities(facilitiesResponse.data);
          
          // Get all facility IDs
          const facilityIds = facilitiesResponse.data.map(facility => facility._id);
          
          // Fetch courts for all facilities
          const courtsPromises = facilityIds.map(venueId => 
            apiFetch(`/api/courts?venue=${venueId}`)
          );
          
          const courtsResponses = await Promise.all(courtsPromises);
          
          // Combine all courts
          let allCourts = [];
          courtsResponses.forEach((response, index) => {
            // The courts API returns an array directly, not wrapped in a data property
            // Handle both possibilities: direct array or data/value property
            const courtsData = Array.isArray(response) ? response : 
                              (response?.data || response?.value || []);
            
            if (courtsData && courtsData.length > 0) {
              // Add facility name to each court for display
              const courtsWithFacilityName = courtsData.map(court => ({
                ...court,
                facilityName: facilitiesResponse.data[index].name
              }));
              allCourts = [...allCourts, ...courtsWithFacilityName];
            }
          });
          
          console.log('All courts:', allCourts); // Debug log
          
          setCourts(allCourts);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load courts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleAddCourt = () => {
    router.push('/owner/courts/add');
  };

  const handleEditCourt = (id) => {
    router.push(`/owner/courts/${id}/edit`);
  };

  const handleDeleteCourt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      return;
    }
    
    try {
      await apiFetch(`/api/courts/${id}`, {
        method: 'DELETE'
      });
      
      // Remove the deleted court from state
      setCourts(courts.filter(court => court._id !== id));
    } catch (err) {
      console.error('Error deleting court:', err);
      setError('Failed to delete court. Please try again.');
    }
  };

  // Format time (e.g., "06:00" to "6:00 AM")
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    } catch (e) {
      return timeString;
    }
  };

  return (
    <DashboardLayout>
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Manage Courts</h1>
        <Button 
          onClick={handleAddCourt}
          iconName="Plus"
          variant="primary"
        >
          Add Court
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-error text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : courts.length === 0 ? (
        <div className="text-center p-8 bg-card border border-border rounded-lg">
          <Icon name="Court" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Courts Found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't added any courts to your facilities yet.
          </p>
          <Button 
            onClick={handleAddCourt}
            variant="primary"
          >
            Add Your First Court
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courts.map((court) => (
            <div key={court._id} className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{court.name}</h3>
                  <p className="text-sm text-muted-foreground">{court.facilityName}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${court.isAvailable ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {court.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Sport: </span>
                  <span className="font-medium">{court.sport}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Price: </span>
                  <span className="font-medium">₹{court.pricePerHour}/hr</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Hours: </span>
                  <span className="font-medium">{formatTime(court.openHour)} - {formatTime(court.closeHour)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Features: </span>
                  <span className="font-medium">{court.features?.length ? court.features.join(', ') : 'None'}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleEditCourt(court._id)}
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDeleteCourt(court._id)}
                  variant="outline"
                  size="sm"
                  iconName="Trash"
                  className="text-error border-error/20 hover:bg-error/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      </main>
    </DashboardLayout>
  );
}