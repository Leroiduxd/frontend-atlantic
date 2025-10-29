import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVault } from '@/hooks/useVault';
import { useToast } from '@/hooks/use-toast';

export const DepositDialog = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { deposit, withdraw, tokenBalance, refetchAll } = useVault();
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await deposit(amount);
      toast({
        title: 'Deposit successful',
        description: `Deposited $${amount}`,
      });
      setAmount('');
      setOpen(false);
      setTimeout(() => refetchAll(), 2000);
    } catch (error: any) {
      toast({
        title: 'Deposit failed',
        description: error?.message || 'Transaction failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await withdraw(amount);
      toast({
        title: 'Withdrawal successful',
        description: `Withdrew $${amount}`,
      });
      setAmount('');
      setOpen(false);
      setTimeout(() => refetchAll(), 2000);
    } catch (error: any) {
      toast({
        title: 'Withdrawal failed',
        description: error?.message || 'Transaction failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="text-xs font-semibold">
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Funds</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Wallet Balance: <span className="font-semibold text-foreground">${tokenBalance}</span>
          </div>
          <div>
            <Input
              type="number"
              placeholder="Amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDeposit}
              disabled={loading}
              className="flex-1 bg-trading-blue hover:bg-trading-blue/90"
            >
              {loading ? 'Processing...' : 'Deposit'}
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
