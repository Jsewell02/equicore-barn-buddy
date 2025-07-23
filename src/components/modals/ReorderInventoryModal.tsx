import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReorderInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    unit: string;
    costPerUnit: number;
    supplier: string;
  } | null;
}

export function ReorderInventoryModal({ isOpen, onClose, item }: ReorderInventoryModalProps) {
  const [quantity, setQuantity] = useState(item ? item.minStock * 2 : 0);
  const [priority, setPriority] = useState("normal");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;
    
    const totalCost = quantity * item.costPerUnit;
    
    toast({
      title: "Reorder Request Submitted",
      description: `${quantity} ${item.unit} of ${item.name} ordered from ${item.supplier} ($${totalCost.toFixed(2)})`,
    });
    
    // Reset form and close
    setQuantity(item.minStock * 2);
    setPriority("normal");
    setNotes("");
    onClose();
  };

  if (!item) return null;

  const suggestedQuantity = item.minStock * 2;
  const totalCost = quantity * item.costPerUnit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Reorder {item.name}
          </DialogTitle>
          <DialogDescription>
            Submit a reorder request to maintain optimal inventory levels.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Stock Info */}
          <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Current Stock Status</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="font-medium text-foreground">{item.currentStock} {item.unit}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Minimum Stock:</span>
                <div className="font-medium text-foreground">{item.minStock} {item.unit}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Cost per Unit:</span>
                <div className="font-medium text-foreground">${item.costPerUnit}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Supplier:</span>
                <div className="font-medium text-foreground">{item.supplier}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Order</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
                <div className="text-xs text-muted-foreground">
                  Suggested: {suggestedQuantity} {item.unit}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special delivery instructions or requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            {/* Order Summary */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Order Summary</span>
                <span className="text-sm text-muted-foreground">{priority} priority</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium text-foreground">{quantity} {item.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Cost:</span>
                  <span className="font-medium text-foreground">${item.costPerUnit}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground border-t pt-1">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="barn">
                Submit Order
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}