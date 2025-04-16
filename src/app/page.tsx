"use client";

import QrCodeScanner from '@/components/QrCodeScanner';
import QrCodeHistory from '@/components/QrCodeHistory';
import QrCodeGenerator from '@/components/QrCodeGenerator';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Toaster} from "@/components/ui/toaster";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster/>
      <h1 className="text-4xl font-bold mb-4 text-primary">
        QR Pal
      </h1>
      <Tabs defaultValue="scan" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>
        <TabsContent value="scan" className="mt-4">
          <QrCodeScanner/>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <QrCodeHistory/>
        </TabsContent>
        <TabsContent value="generate" className="mt-4">
          <QrCodeGenerator/>
        </TabsContent>
      </Tabs>
    </div>
  );
}

