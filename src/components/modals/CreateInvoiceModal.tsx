import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Plus, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { horses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
  const [clientName, setClientName] = useState("");
  const [selectedHorses, setSelectedHorses] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Monthly Boarding", quantity: 1, rate: 850 }
  ]);
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInvoiceId = `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    toast({
      title: "Invoice Created Successfully",
      description: `Invoice ${newInvoiceId} for ${clientName} ($${total.toLocaleString()}) has been created.`,
    });
    
    // Reset form and close
    setClientName("");
    setSelectedHorses([]);
    setDueDate(undefined);
    setItems([{ description: "Monthly Boarding", quantity: 1, rate: 850 }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Create New Invoice
          </DialogTitle>
          <DialogDescription>
            Generate a new invoice for boarding and services.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Associated Horses</Label>
            <Select onValueChange={(value) => setSelectedHorses([...selectedHorses, value])}>
              <SelectTrigger>
                <SelectValue placeholder="Select horses" />
              </SelectTrigger>
              <SelectContent>
                {horses.map((horse) => (
                  <SelectItem key={horse.id} value={horse.name}>
                    {horse.name} - {horse.owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHorses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedHorses.map((horse, index) => (
                  <div key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {horse}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="Service description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs">Total</Label>
                  <div className="text-sm font-medium text-right py-2">
                    ${(item.quantity * item.rate).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="barn">
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}