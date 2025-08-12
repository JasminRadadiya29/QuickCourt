'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const ApprovalStatus = ({ approved, onApprovalChange, facilityId }) => {
  // Handle case where approved might be undefined or not a boolean
  const isApproved = approved === true || approved === 'true' || approved === 'approved';
  
  const statusConfig = {
    true: { color: 'bg-success/10 text-success', icon: 'CheckCircle', text: 'Approved' },
    false: { color: 'bg-warning/10 text-warning', icon: 'Clock', text: 'Pending Approval' }
  };

  // Default to pending if config is undefined
  const config = statusConfig[isApproved.toString()] || statusConfig['false'];

  const handleApprovalChange = async () => {
    if (onApprovalChange) {
      onApprovalChange(facilityId, !isApproved);
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
        {isApproved ? 'Revoke Approval' : 'Approve'}
      </Button>
    </div>
  );
};

const FacilityCard = ({ facility, onApprovalChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {facility.images && facility.images.length > 0 ? (
          <img 
            src={facility.images[0]} 
            alt={facility.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon name="Image" size={48} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-foreground">{facility.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{facility.address}</p>
          </div>
          <ApprovalStatus 
            approved={facility.approved || facility.approvalStatus === 'approved'} 
            onApprovalChange={onApprovalChange}
            facilityId={facility._id}
          />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Icon name="User" size={16} className="text-muted-foreground mr-2" />
            <span>{facility.owner?.name || 'Unknown Owner'}</span>
          </div>
          
          <div className="flex items-center">
            <Icon name="MapPin" size={16} className="text-muted-foreground mr-2" />
            <span className="truncate">{facility.address}</span>
          </div>
          
          <div className="flex items-center">
            <Icon name="Phone" size={16} className="text-muted-foreground mr-2" />
            <span>{facility.contactPhone || 'No phone provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // all, approved, pending
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingApproval, setUpdatingApproval] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, [page, filter, searchQuery]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = filter === 'pending' 
        ? `/api/admin/venues/pending?page=${page}` 
        : `/api/admin/venues?page=${page}`;
      
      if (filter === 'approved') url += '&approved=true';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      
      const data = await apiFetch(url);
      setFacilities(data.venues || []);
      setTotalPages(Math.ceil(data.pagination.total / data.pagination.size) || 1);
    } catch (err) {
      setError('Failed to load facilities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (facilityId, approve) => {
    try {
      setUpdatingApproval(true);
      await apiFetch(`/api/admin/venues/${facilityId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({
          approve,
          reason: approve ? 'Approved by administrator' : 'Approval revoked by administrator'
        })
      });
      
      // Update the facility in the local state
      setFacilities(facilities.map(facility => 
        facility._id === facilityId ? { 
          ...facility, 
          approved: approve,
          approvalStatus: approve ? 'approved' : 'pending'
        } : facility
      ));
    } catch (err) {
      setError(`Failed to ${approve ? 'approve' : 'revoke approval for'} facility`);
      console.error(err);
    } finally {
      setUpdatingApproval(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchFacilities();
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
          <div className="flex bg-muted rounded-md p-1">
            <button
              onClick={() => {
                setFilter('pending');
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'pending' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Pending
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
                setFilter('all');
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              All
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 w-full">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or address"
              className="flex-1 bg-muted border border-border rounded-l-md px-3 py-1 text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 py-1 rounded-r-md"
            >
              <Icon name="Search" size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 text-error p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : facilities.length > 0 ? (
        <>
          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map(facility => (
              <FacilityCard 
                key={facility._id} 
                facility={facility} 
                onApprovalChange={handleApprovalChange}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Facilities Found</h3>
          <p className="text-muted-foreground mb-4">
            {filter !== 'all' || searchQuery
              ? 'No facilities match your current filters.'
              : 'There are no facilities in the system yet.'}
          </p>
          {(filter !== 'all' || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
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

export default AdminFacilities;