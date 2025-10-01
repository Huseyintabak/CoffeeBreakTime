import React, { useState } from 'react';
import { Download, X, Smartphone, Share, Plus } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import Button from './Button';
import Modal from './Modal';

interface InstallPromptProps {
  onDismiss?: () => void;
  className?: string;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({
  onDismiss,
  className = '',
}) => {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    installPWA,
    getIOSInstallInstructions,
    getInstallMethod,
  } = usePWA();

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installPWA();
      if (success) {
        onDismiss?.();
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleIOSInstall = () => {
    setShowIOSInstructions(true);
  };

  const renderInstallContent = () => {
    const installMethod = getInstallMethod();

    switch (installMethod) {
      case 'native':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-coffee-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Coffee Timer'ı Yükleyin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Uygulamayı cihazınıza yükleyerek daha hızlı erişim sağlayın ve 
                  offline çalışma özelliklerinden faydalanın.
                </p>
              </div>
            </div>
            
            <div className="bg-cream-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-foreground text-sm">Yükleme Avantajları:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Daha hızlı başlatma</li>
                <li>• Offline çalışma</li>
                <li>• Ana ekrandan direkt erişim</li>
                <li>• Daha az veri kullanımı</li>
              </ul>
            </div>
          </div>
        );

      case 'ios':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Share className="w-6 h-6 text-coffee-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  iOS Cihazınızda Yükleyin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Safari'de "Paylaş" butonunu kullanarak uygulamayı ana ekranınıza ekleyin.
                </p>
              </div>
            </div>
            
            <div className="bg-cream-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Adım adım talimatları görüntüle
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIOSInstall}
                >
                  Talimatlar
                </Button>
              </div>
            </div>
          </div>
        );

      case 'android':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-coffee-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Android Cihazınızda Yükleyin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chrome menüsünden "Ana ekrana ekle" seçeneğini kullanın.
                </p>
              </div>
            </div>
            
            <div className="bg-cream-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-foreground text-sm">Yükleme Adımları:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Chrome menüsünü açın (3 nokta)</li>
                <li>"Ana ekrana ekle" seçeneğini bulun</li>
                <li>"Ekle" butonuna dokunun</li>
              </ol>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-2">
            <Smartphone className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Bu tarayıcı PWA yüklemesini desteklemiyor.
            </p>
          </div>
        );
    }
  };

  const renderIOSInstructions = () => (
    <Modal
      isOpen={showIOSInstructions}
      onClose={() => setShowIOSInstructions(false)}
      title="iOS Yükleme Talimatları"
      size="md"
    >
      <div className="space-y-4">
        {getIOSInstallInstructions().map((instruction, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-coffee-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-sm text-foreground">{instruction}</p>
          </div>
        ))}
        
        <div className="bg-cream-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-coffee-600" />
            <span className="text-sm font-medium text-foreground">
              Yükleme tamamlandıktan sonra ana ekranınızdan uygulamaya erişebilirsiniz.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <div className={`bg-surface border border-border rounded-xl p-4 shadow-sm ${className}`}>
        <div className="flex items-start justify-between mb-4">
          {renderInstallContent()}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {getInstallMethod() === 'native' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstall}
              loading={isInstalling}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isInstalling ? 'Yükleniyor...' : 'Yükle'}
            </Button>
          )}
          
          {getInstallMethod() === 'ios' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleIOSInstall}
              className="flex-1"
            >
              <Share className="w-4 h-4 mr-2" />
              Talimatları Gör
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
          >
            Daha Sonra
          </Button>
        </div>
      </div>
      
      {renderIOSInstructions()}
    </>
  );
};

export default InstallPrompt;
