import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditStopsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  positionId: number;
  currentSL: number;
  currentTP: number;
  onConfirm: (id: number, slPrice: string, tpPrice: string) => void;
}

export const EditStopsDialog = ({
  open,
  onOpenChange,
  positionId,
  currentSL,
  currentTP,
  onConfirm,
}: EditStopsDialogProps) => {
  const [slPrice, setSlPrice] = useState((currentSL / 1000000).toFixed(2));
  const [tpPrice, setTpPrice] = useState((currentTP / 1000000).toFixed(2));

  const handleConfirm = () => {
    onConfirm(positionId, slPrice, tpPrice);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Stop Loss & Take Profit</DialogTitle>
          <DialogDescription>
            Update the stop loss and take profit for your position.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sl">Stop Loss (USD)</Label>
            <Input
              id="sl"
              type="number"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp">Take Profit (USD)</Label>
            <Input
              id="tp"
              type="number"
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
