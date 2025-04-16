"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { categorizeQrCodeContent } from "@/lib/qr-code-utils";
import { useRouter } from "next/navigation";
import { useIsVisible } from "@/hooks/use-is-visible";

interface QrCodeScannerProps {
  isActive: boolean;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ isActive }) => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isVisible = useIsVisible();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error: any) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    if (isActive && isVisible) {
      getCameraPermission();
    } else {
      // If the component is not active or not visible, clear the camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setHasCameraPermission(false);
        setIsScanning(false);
      }
    }
  }, [isActive, toast, isVisible]);

  const scanQrCode = useCallback(async () => {
    if (!hasCameraPermission || !videoRef.current || isScanning) {
      return;
    }

    setIsScanning(true);
    const codeReader = new BrowserQRCodeReader();

    try {
      const result = await codeReader.decodeFromInputVideoDevice(undefined, videoRef.current);
      handleScanResult(result.text);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
      toast({
        variant: 'destructive',
        title: 'Scan Error',
        description: `Error scanning QR code: ${err.message}`,
      });
    } finally {
      setIsScanning(false);
    }
  }, [hasCameraPermission, toast, isScanning]);

  useEffect(() => {
    if (hasCameraPermission && videoRef.current && isActive && isVisible && !isScanning) {
      scanQrCode();
    }
  }, [hasCameraPermission, scanQrCode, isActive, isVisible, isScanning]);

  const handleScanResult = (decodedText: string) => {
    setResult(decodedText);
    setError(null);

    if (navigator.vibrate) {
      navigator.vibrate(200); // Vibrate for 200ms
    }

    const category = categorizeQrCodeContent(decodedText);

    // Store the scanned QR code data with the determined category
    saveScanResult(decodedText, category);

    toast({
      title: 'QR Code Scanned',
      description: `Successfully scanned QR code. Category: ${category}`,
    });
    router.refresh();
  };

  const saveScanResult = (data: string, tag: string) => {
    const id = Date.now().toString();
    const newItem = { id, data, tag };

    // Retrieve existing history from localStorage
    const storedHistory = localStorage.getItem('qrHistory');
    const existingHistory = storedHistory ? JSON.parse(storedHistory) : [];

    // Add the new item to the history
    const updatedHistory = [newItem, ...existingHistory];

    // Save the updated history back to localStorage
    localStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

      {!(hasCameraPermission) && (
        <Alert variant="destructive">
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access to use this feature.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="mt-4 p-4 border rounded">
          Result: {result}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 border rounded text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;
