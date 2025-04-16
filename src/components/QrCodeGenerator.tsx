"use client";

import { useState } from 'react';
import qrcode from 'qrcode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const QrCodeGenerator = () => {
  const [qrText, setQrText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const {toast} = useToast();

  const generateQrCode = async () => {
    try {
      const qrCodeDataURL = await qrcode.toDataURL(qrText);
      setQrCode(qrCodeDataURL);
      toast({
        title: 'QR Code Generated',
        description: 'Successfully generated QR code.',
      });
    } catch (error: any) {
      console.error("Error generating QR code", error);
      toast({
        variant: 'destructive',
        title: 'Generation Error',
        description: `Error generating QR code: ${error.message}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Input
        type="text"
        placeholder="Enter link or text"
        value={qrText}
        onChange={(e) => setQrText(e.target.value)}
        className="mb-4"
      />
      <Button onClick={generateQrCode}>Generate QR Code</Button>
      {qrCode && (
        <div className="mt-4">
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
