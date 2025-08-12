'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const UserStatus = ({ status, onStatusChange, userId }) => {
  const statusConfig = {
    active: { color: 'bg-success/10 text-success', icon: 'CheckCircle', text: 'Active' },
    banned: { color: 'bg-error/10 text-error', icon: 'XCircle', text: 'Banned' }
  };

  const config = statusConfig[status] || statusConfig.active;

  const handleStatusChange = async () => {
    if (onStatusChange) {
      onStatusChange(userId, status === 'active' ? 'banned' : 'active');
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
        onClick={handleStatusChange}
      >
        {status === 'active' ? 'Ban User' : 'Unban User'}
      </Button>
    </div>
  );
};

const UserCard = ({ user, onStatusChange }) => {
  const roleConfig = {
    user: { color: 'bg-primary/10 text-primary', icon: 'User' },
    facility_owner: { color: 'bg-secondary/10 text-secondary', icon: 'Building2' },
    admin: { color: 'bg-warning/10 text-warning', icon: 'Shield' }
  };

  const config = roleConfig[user.role] || roleConfig.user;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <UserStatus 
          status={user.status} 
          onStatusChange={onStatusChange}
          userId={user._id}
        />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color}`}>
            <Icon name={config.icon} size={14} />
            <span className="text-xs capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Icon name="Clock" size={16} className="text-muted-foreground mr-2" />
          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all'); // all, user, facility_owner, admin
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, banned
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/admin/users?page=${page}`;
      if (roleFilter !== 'all') url += `&role=${roleFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      
      const data = await apiFetch(url);
      setUsers(data.users || []);
      setTotalPages(Math.ceil(data.pagination.total / data.pagination.size) || 1);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await apiFetch(`/api/admin/users/${userId}/ban`, {
        method: 'PATCH',
        body: JSON.stringify({
          ban: newStatus === 'banned',
          reason: newStatus === 'banned' ? 'Banned by administrator' : 'Unbanned by administrator'
        })
      });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      setError(`Failed to ${newStatus === 'banned' ? 'ban' : 'unban'} user`);
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border border-border rounded-md px-3 py-1 text-sm w-full md:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="facility_owner">Facility Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border border-border rounded-md px-3 py-1 text-sm w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 w-full">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
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
      ) : users.length > 0 ? (
        <>
          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <UserCard 
                key={user._id} 
                user={user} 
                onStatusChange={handleStatusChange}
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
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Users Found</h3>
          <p className="text-muted-foreground mb-4">
            {roleFilter !== 'all' || statusFilter !== 'all' || searchQuery
              ? 'No users match your current filters.'
              : 'There are no users in the system yet.'}
          </p>
          {(roleFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setRoleFilter('all');
                setStatusFilter('all');
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

export default AdminUsers;