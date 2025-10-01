import React, { useEffect } from 'react';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface NotificationManagerProps {
  onTimerComplete?: (duration: number) => void;
  onTimerStart?: (duration: number) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  onTimerComplete,
  onTimerStart,
}) => {
  const {
    permission,
    isSupported,
    canNotify,
    requestPermission,
    showTimerCompleteNotification,
    showTimerStartNotification,
    showBreakReminderNotification,
  } = useNotification();
  
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  
  // Request permission on first load
  useEffect(() => {
    if (isSupported && permission === 'default') {
      setShowPermissionModal(true);
    }
  }, [isSupported, permission]);
  
  // Handle permission request
  const handleRequestPermission = async () => {
    try {
      await requestPermission();
      setShowPermissionModal(false);
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };
  
  // Handle permission denial
  const handleDenyPermission = () => {
    setShowPermissionModal(false);
  };
  
  // Show timer completion notification
  const handleTimerComplete = (duration: number) => {
    if (canNotify) {
      showTimerCompleteNotification(duration);
    }
    onTimerComplete?.(duration);
  };
  
  // Show timer start notification
  const handleTimerStart = (duration: number) => {
    if (canNotify) {
      showTimerStartNotification(duration);
    }
    onTimerStart?.(duration);
  };
  
  // Show break reminder (can be called periodically)
  const showBreakReminder = () => {
    if (canNotify) {
      showBreakReminderNotification();
    }
  };
  
  // Permission Modal
  const PermissionModal = () => (
    <Modal
      isOpen={showPermissionModal}
      onClose={handleDenyPermission}
      title="Bildirim İzni"
      closeOnOverlayClick={false}
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Bell className="w-6 h-6 text-coffee-600 mt-1" />
          <div>
            <h3 className="font-medium text-foreground mb-2">
              Bildirimler için izin verin
            </h3>
            <p className="text-sm text-muted-foreground">
              Timer tamamlandığında ve molalar için size bildirim gönderebilmemiz için 
              lütfen bildirim izni verin. Bu sayede çalışma rutininizi daha iyi takip edebilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={handleRequestPermission}
            className="flex-1"
          >
            <Bell className="w-4 h-4 mr-2" />
            İzin Ver
          </Button>
          <Button
            variant="outline"
            onClick={handleDenyPermission}
            className="flex-1"
          >
            <BellOff className="w-4 h-4 mr-2" />
            Şimdi Değil
          </Button>
        </div>
      </div>
    </Modal>
  );
  
  // Notification Status Indicator
  const NotificationStatus = () => {
    if (!isSupported) {
      return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Bildirimler desteklenmiyor</span>
        </div>
      );
    }
    
    if (permission === 'denied') {
      return (
        <div className="flex items-center space-x-2 text-sm text-error">
          <BellOff className="w-4 h-4" />
          <span>Bildirimler devre dışı</span>
        </div>
      );
    }
    
    if (canNotify) {
      return (
        <div className="flex items-center space-x-2 text-sm text-success">
          <Bell className="w-4 h-4" />
          <span>Bildirimler aktif</span>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <>
      <PermissionModal />
      
      {/* Export functions for parent components */}
      {React.useEffect(() => {
        // This is a bit of a hack, but it allows parent components to access these functions
        // In a real app, you'd use a context or event system
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).notificationManager = {
            showTimerComplete: handleTimerComplete,
            showTimerStart: handleTimerStart,
            showBreakReminder,
            status: <NotificationStatus />,
          };
        }
      }, [canNotify, permission, isSupported])}
    </>
  );
};

export default NotificationManager;
