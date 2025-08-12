'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const ApprovalStatus = ({ approved, onApprovalChange, courtId }) => {
  const statusConfig = {
    true: { color: 'bg-success/10 text-success', icon: 'CheckCircle', text: 'Approved' },
    false: { color: 'bg-warning/10 text-warning', icon: 'Clock', text: 'Pending Approval' }
  };

  const config = statusConfig[approved.toString()];

  const handleApprovalChange = async () => {
    if (onApprovalChange) {
      onApprovalChange(courtId, !approved);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color}`}>
        <Icon name={config.icon} size={14} />
        <span className="text-xs">{config.text}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleApprovalChange}
      >
        {approved ? 'Revoke Approval' : 'Approve'}
      </Button>
    </div>
  );
};

const CourtCard = ({ court, onApprovalChange }) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-foreground">{court.name}</h3>
            <p className="text-sm text-muted-foreground">{court.facilityName}</p>
          </div>
          <ApprovalStatus 
            approved={court.approved} 
            onApprovalChange={onApprovalChange}
            courtId={court._id}
          />
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
      </div>
    </div>
  );
};

const AdminCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingApproval, setUpdatingApproval] = useState(false);

  useEffect(() => {
    fetchFacilities();
    fetchCourts();
  }, [page, filter, facilityFilter]);

  const fetchFacilities = async () => {
    try {
      const response = await apiFetch('/api/facilities');
      const facilitiesData = response?.data || [];
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    }
  };

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/courts?page=${page}`;
      if (filter === 'approved') url += '&approved=true';
      if (filter === 'pending') url += '&approved=false';
      if (facilityFilter !== 'all') url += `&venue=${facilityFilter}`;
      
      const response = await apiFetch(url);
      const courtsData = Array.isArray(response) ? response : (response?.data || []);
      
      // Fetch facility names for each court
      const courtsWithFacilityNames = await Promise.all(
        courtsData.map(async (court) => {
          try {
            const facilityResponse = await apiFetch(`/api/facilities/${court.venue}`);
            return {
              ...court,
              facilityName: facilityResponse?.name || 'Unknown Facility'
            };
          } catch (err) {
            return {
              ...court,
              facilityName: 'Unknown Facility'
            };
          }
        })
      );
      
      setCourts(courtsWithFacilityNames);
      // Use the totalPages from the API response if available, otherwise calculate it
      setTotalPages(response?.totalPages || Math.ceil(courtsWithFacilityNames.length / 10) || 1);
    } catch (err) {
      setError('Failed to load courts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (courtId, newApprovalStatus) => {
    try {
      setUpdatingApproval(true);
      
      await apiFetch(`/api/courts/${courtId}`, {
        method: 'PUT',
        body: JSON.stringify({
          approved: newApprovalStatus
        })
      });
      
      // Update local state
      setCourts(courts.map(court => 
        court._id === courtId ? { ...court, approved: newApprovalStatus } : court
      ));
    } catch (err) {
      setError('Failed to update court approval status');
      console.error(err);
    } finally {
      setUpdatingApproval(false);
    }
  };

  // Filter courts based on approval status
  const filteredCourts = courts.filter(court => {
    if (filter === 'all') return true;
    if (filter === 'approved') return court.approved === true;
    if (filter === 'pending') return court.approved === false;
    return true;
  });

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-md text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
          <div className="flex bg-muted rounded-md p-1">
            <button
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter('approved');
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'approved' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Approved
            </button>
            <button
              onClick={() => {
                setFilter('pending');
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'pending' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Pending
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Facility</label>
          <select
            value={facilityFilter}
            onChange={(e) => {
              setFacilityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border border-border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Facilities</option>
            {facilities.map(facility => (
              <option key={facility._id} value={facility._id}>{facility.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Courts List */}
      {filteredCourts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourts.map((court) => (
              <CourtCard
                key={court._id}
                court={court}
                onApprovalChange={handleApprovalChange}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || loading}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8">
          <Icon name="Court" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Courts Found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'all' && facilityFilter === 'all'
              ? 'There are no courts in the system yet.'
              : 'No courts match your current filters.'}
          </p>
          {(filter !== 'all' || facilityFilter !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setFilter('all');
                setFacilityFilter('all');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCourts;