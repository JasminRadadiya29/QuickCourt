import React, { useState, useEffect } from 'react';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';
import { apiFetch, getCurrentUser } from '@/lib/apiClient';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize profile data with empty values
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateJoined: '',
    totalBookings: 0,
    profilePhoto: ''
  });
  
  const [formData, setFormData] = useState({ ...profileData });
  
  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Load user data on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      setError('User not logged in');
      return;
    }
    
    let cancelled = false;
    
    async function loadUserData() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching user profile data');
        
        // Get user profile data from the new API endpoint
        const userData = await apiFetch('/api/users/profile');
        console.log('User profile data:', userData);
        
        if (!cancelled) {
          const newProfileData = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            dateJoined: formatDate(userData.createdAt || new Date()),
            totalBookings: userData.bookingCount || 0,
            profilePhoto: userData.avatar?.data ? {
              data: userData.avatar.data,
              contentType: userData.avatar.contentType
            } : userData.avatar || 'https://testingbot.com/free-online-tools/random-avatar/300'
          };
          
          setProfileData(newProfileData);
          setFormData(newProfileData);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        if (!cancelled) {
          setError('Failed to load user profile');
          // Fallback to basic user info from localStorage if API fails
          const localUser = getCurrentUser();
          if (localUser) {
            const fallbackData = {
              name: localUser.name || '',
              email: localUser.email || '',
              phone: '',
              dateJoined: '',
              totalBookings: 0,
              profilePhoto: localUser.avatar?.data ? {
                data: localUser.avatar.data,
                contentType: localUser.avatar.contentType
              } : localUser.avatar || 'https://testingbot.com/free-online-tools/random-avatar/300'
            };
            
            setProfileData(fallbackData);
            setFormData(fallbackData);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadUserData();
    return () => { cancelled = true; };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;
      
      // Update user profile via API
      const updatedUser = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: {
          name: formData.name,
          phone: formData.phone,
          avatar: formData.profilePhoto
        }
      });
      
      // Update local storage user data
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedLocalUser = {
          ...currentUser,
          name: updatedUser.name,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar
        };
        localStorage.setItem('user', JSON.stringify(updatedLocalUser));
      }
      
      // Update profile data state
      setProfileData({
        ...profileData,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profilePhoto: updatedUser.avatar || profileData.profilePhoto
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Loader" size={32} className="text-muted-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Loading your profile...</h3>
        </div>
      )}
      
      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} className="text-error" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      )}
      
      {/* Profile Content */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
            {!isEditing && (
              <Button
                variant="outline"
                iconName="Edit"
                iconPosition="left"
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo Section */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mx-auto">
                    {typeof formData.profilePhoto === 'object' && formData.profilePhoto?.data ? (
                      <img
                        src={formData.profilePhoto.previewUrl || `data:${formData.profilePhoto.contentType};base64,${formData.profilePhoto.data}`}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={formData.profilePhoto || 'https://testingbot.com/free-online-tools/random-avatar/300'}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        // Create a hidden file input element
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.style.display = 'none';
                        
                        // Handle file selection
                        fileInput.onchange = async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          try {
                            // Create URL for preview
                            const previewUrl = URL.createObjectURL(file);
                            
                            // Convert file to base64 for storage
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64Data = event.target.result;
                              setFormData({
                                ...formData,
                                profilePhoto: {
                                  data: base64Data.split(',')[1],
                                  contentType: file.type,
                                  previewUrl // Store preview URL for local display
                                }
                              });
                            };
                            reader.readAsDataURL(file);
                          } catch (err) {
                            console.error('Error processing image:', err);
                            alert('Failed to process image. Please try again.');
                          }
                        };
                        
                        // Trigger file selection dialog
                        document.body.appendChild(fileInput);
                        fileInput.click();
                        document.body.removeChild(fileInput);
                      }}
                    >
                      <Icon name="Camera" size={16} />
                    </button>
                  )}
                </div>
                <h3 className="text-lg font-medium text-foreground mt-4">{formData.name}</h3>
                <p className="text-muted-foreground">{formData.email}</p>
              </div>
            </div>
            
            {/* Profile Details Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <p className="text-foreground">{profileData.name}</p>
                  )}
                </div>
                
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                  <p className="text-foreground">{profileData.email}</p>
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-foreground">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>
                
                {/* Account Info */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Account Information</label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Icon name="Calendar" size={16} className="text-muted-foreground mr-2" />
                      <span>Joined {profileData.dateJoined || 'Recently'}</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Ticket" size={16} className="text-muted-foreground mr-2" />
                      <span>{profileData.totalBookings} Bookings</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileTab;