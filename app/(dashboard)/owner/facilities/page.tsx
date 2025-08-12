'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import { useAuth } from 'app/providers';
import { apiFetch } from '@/lib/apiClient';
import DashboardLayout from '../../components/DashboardLayout';

export default function OwnerFacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (!user?._id) return;
        
        const response = await apiFetch(`/api/facilities?owner=${user._id}`);
        if (response?.data) {
          setFacilities(response.data);
        }
      } catch (err) {
        console.error('Error fetching facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacilities();
  }, [user]);

  const handleAddFacility = () => {
    router.push('/owner/facilities/add');
  };

  const handleEditFacility = (id) => {
    router.push(`/owner/facilities/${id}/edit`);
  };

  return (
    <DashboardLayout>
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Manage Facilities & Availability</h1>
        <Button 
          onClick={handleAddFacility}
          iconName="Plus"
          variant="primary"
        >
          Add Facility
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((facility) => (
            <div key={facility._id} className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground">{facility.address}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${facility.approved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {facility.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Icon name="MapPin" size={16} className="mr-1" />
                <span>{facility.address}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleEditFacility(facility._id)}
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                >
                  Edit Details
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  iconName="Calendar"
                >
                  Set Availability
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