"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  data: string;
  tag: string;
}

const QrCodeHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editItem, setEditItem] = useState<HistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const {toast} = useToast();

  useEffect(() => {
    const storedHistory = localStorage.getItem('qrHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qrHistory', JSON.stringify(history));
  }, [history]);

  const handleEdit = (item: HistoryItem) => {
    setEditItem(item);
    setNewTag(item.tag);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      const updatedHistory = history.map(item =>
        item.id === editItem.id ? {...item, tag: newTag} : item
      );
      setHistory(updatedHistory);
      setIsDialogOpen(false);
      toast({
        title: 'History Updated',
        description: 'Successfully updated history item.',
      });
    }
  };

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    toast({
      title: 'History Deleted',
      description: 'Successfully deleted history item.',
    });
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your scanned QR codes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.data}</TableCell>
              <TableCell>{item.tag}</TableCell>
              <TableCell>
                <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag for the selected QR code data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <Input id="tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QrCodeHistory;

    