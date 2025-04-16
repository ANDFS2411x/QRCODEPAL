"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QrCodeScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const {toast} = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
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

    getCameraPermission();
  }, [toast]);

  const handleScan = useCallback(async () => {
    const codeReader = new BrowserQRCodeReader();

    try {
      const result = await codeReader.decodeFromInputVideoDevice(undefined, 'video');
      setResult(result.text);
      setError(null);
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrate for 200ms
      }
      toast({
        title: 'QR Code Scanned',
        description: 'Successfully scanned QR code.',
      });
    } catch (err: any) {
      setError(err.message);
      setResult(null);
      toast({
        variant: 'destructive',
        title: 'Scan Error',
        description: `Error scanning QR code: ${err.message}`,
      });
    }
  }, [toast]);

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="secondary"
        onClick={handleScan}
        disabled={!hasCameraPermission}
      >
        Scan QR Code
      </Button>

      <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

      { !(hasCameraPermission) && (
          <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
          </Alert>
      )
      }

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

    