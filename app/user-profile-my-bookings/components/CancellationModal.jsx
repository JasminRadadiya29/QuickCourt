import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import { Checkbox } from 'app/components/ui/Checkbox';
import Icon from 'app/components/AppIcon';

const CancellationModal = ({ booking, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !booking) return null;

  const calculateRefund = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilBooking >= 24) {
      return { amount: booking?.totalAmount, percentage: 100 };
    } else if (hoursUntilBooking >= 12) {
      return { amount: booking?.totalAmount * 0.75, percentage: 75 };
    } else if (hoursUntilBooking >= 6) {
      return { amount: booking?.totalAmount * 0.5, percentage: 50 };
    } else {
      return { amount: 0, percentage: 0 };
    }
  };

  const refundInfo = calculateRefund();

  const handleConfirm = async () => {
    if (!agreedToPolicy) return;
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConfirm(booking?.id, reason);
    setIsProcessing(false);
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setAgreedToPolicy(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-1050 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Cancel Booking</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-accent rounded-md transition-smooth"
            disabled={isProcessing}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Booking Details</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Venue:</span> {booking?.venueName}</p>
              <p><span className="font-medium">Court:</span> {booking?.courtName}</p>
              <p><span className="font-medium">Date:</span> {new Date(booking.date)?.toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {booking?.startTime} - {booking?.endTime}</p>
              <p><span className="font-medium">Amount:</span> ${booking?.totalAmount}</p>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Refund Policy</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• 24+ hours before: 100% refund</p>
                  <p>• 12-24 hours before: 75% refund</p>
                  <p>• 6-12 hours before: 50% refund</p>
                  <p>• Less than 6 hours: No refund</p>
                </div>
                
                <div className="mt-3 p-3 bg-card rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Your refund:</span>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-success">${refundInfo?.amount}</span>
                      <span className="text-sm text-muted-foreground ml-1">({refundInfo?.percentage}%)</span>
                    </div>
                  </div>
                  {refundInfo?.percentage < 100 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Refund will be processed within 3-5 business days
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <Input
              label="Reason for cancellation (optional)"
              type="text"
              placeholder="Please let us know why you're cancelling..."
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              description="This helps us improve our service"
            />
          </div>

          {/* Agreement Checkbox */}
          <div>
            <Checkbox
              label="I understand the cancellation policy and agree to the refund terms"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e?.target?.checked)}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!agreedToPolicy || isProcessing}
            loading={isProcessing}
            iconName="X"
            iconPosition="left"
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;