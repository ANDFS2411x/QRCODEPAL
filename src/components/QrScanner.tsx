"use client";

import { useState, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

const QrScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(async () => {
    const codeReader = new BrowserQRCodeReader();

    try {
      const result = await codeReader.decodeFromInputVideoDevice(undefined, 'video');
      setResult(result.text);
      setError(null);
    } catch (err: any) {
      setError(err);
      setResult(null);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-primary hover:bg-accent text-primary-foreground font-bold py-2 px-4 rounded"
        onClick={handleScan}
      >
        Scan QR Code
      </button>
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
      <video id="video" width="300" height="200" className="mt-4" />
    </div>
  );
};

export default QrScanner;
