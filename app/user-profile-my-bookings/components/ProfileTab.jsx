import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import Image from 'app/components/AppImage';
import Icon from 'app/components/AppIcon';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateJoined: '2024-01-15',
    totalBookings: 24,
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  });
  const [formData, setFormData] = useState({ ...profileData });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Email is invalid';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProfileData({ ...formData });
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setErrors({});
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // Simulate Cloudinary upload
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, profilePhoto: event?.target?.result }));
      };
      reader?.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
        {!isEditing && (
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
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
                <Image
                  src={formData?.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-smooth">
                  <Icon name="Camera" size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-medium text-foreground">{profileData?.name}</h3>
              <p className="text-sm text-muted-foreground">Member since {new Date(profileData.dateJoined)?.toLocaleDateString()}</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span className="text-muted-foreground">{profileData?.totalBookings} bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData?.name}
              onChange={handleInputChange}
              error={errors?.name}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData?.email}
              onChange={handleInputChange}
              error={errors?.email}
              disabled={!isEditing}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData?.phone}
              onChange={handleInputChange}
              error={errors?.phone}
              disabled={!isEditing}
              required
            />

            {isEditing && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">Change Password</h4>
                <div className="space-y-3">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="default"
                  loading={isSaving}
                  onClick={handleSave}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;