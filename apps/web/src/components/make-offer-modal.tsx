"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Loader2,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MakeOfferModalProps {
  domain: any;
  isOpen: boolean;
  onClose: () => void;
}

type OfferStep =
  | "form"
  | "connecting"
  | "signing"
  | "processing"
  | "success"
  | "error";

export function MakeOfferModal({
  domain,
  isOpen,
  onClose,
}: MakeOfferModalProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [step, setStep] = useState<OfferStep>("form");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerDuration, setOfferDuration] = useState("7"); // days
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setOfferAmount("");
      setOfferDuration("7");
      setError(null);
      setTxHash(null);
    }
  }, [isOpen]);

  const connectWallet = async (): Promise<string> => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          return accounts[0];
        }
        throw new Error("No accounts found");
      } catch (error) {
        throw new Error("Failed to connect wallet");
      }
    }
    throw new Error("Web3 wallet not found. Please install MetaMask");
  };

  const handleMakeOffer = async () => {
    try {
      if (!offerAmount || parseFloat(offerAmount) <= 0) {
        setError("Please enter a valid offer amount");
        return;
      }

      const currentPrice = parseFloat(domain.currentPrice.replace(" ETH", ""));
      const offer = parseFloat(offerAmount);

      if (offer >= currentPrice) {
        setError("Offer must be lower than current price");
        return;
      }

      setStep("connecting");
      setError(null);

      const walletAddress = await connectWallet();
      setUserWalletAddress(walletAddress);

      setStep("signing");

      const offerParams = {
        orderbook: domain.orderbook,
        chainId: domain.chainId,
        parameters: {
          offerer: walletAddress,
          zone: "0x0000000000000000000000000000000000000000",
          orderType: 0,
          startTime: Math.floor(Date.now() / 1000).toString(),
          endTime: Math.floor(
            (Date.now() + parseInt(offerDuration) * 24 * 60 * 60 * 1000) / 1000,
          ).toString(),
          zoneHash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: Math.floor(Math.random() * 1000000).toString(),
          offer: [
            {
              itemType: 1,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: (offer * 1e18).toString(),
              endAmount: (offer * 1e18).toString(),
            },
          ],
          consideration: [
            {
              itemType: 2,
              token: domain.contractAddress,
              identifierOrCriteria: domain.tokenId,
              startAmount: "1",
              endAmount: "1",
              recipient: walletAddress,
            },
          ],
          totalOriginalConsiderationItems: 1,
          conduitKey:
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
          counter: "0",
        },
      };

      if (typeof window !== "undefined" && (window as any).ethereum) {
        const signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [JSON.stringify(offerParams.parameters), walletAddress],
        });

        offerParams.signature = signature;
      }

      setStep("processing");

      const response = await fetch("/api/orderbook/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerParams),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create offer");
      }

      const data = await response.json();

      if (data.transactionHash) {
        setTxHash(data.transactionHash);
      }

      setStep("success");

      toast({
        title: "Offer Submitted!",
        description: `Your offer of ${offerAmount} ETH for ${domain.domain} has been submitted`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
      toast({
        title: "Offer Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case "form":
        const currentPrice = parseFloat(
          domain.currentPrice.replace(" ETH", ""),
        );
        const offer = parseFloat(offerAmount) || 0;
        const discount =
          offer > 0
            ? (((currentPrice - offer) / currentPrice) * 100).toFixed(1)
            : 0;

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Make an Offer for {domain.domain}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Current price: <strong>{domain.currentPrice}</strong>
              </p>
            </div>

            {/* Offer Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Offer (ETH)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentPrice - 0.01}
                  placeholder="Enter your offer amount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
                {offer > 0 && offer < currentPrice && (
                  <p className="text-sm text-green-600 mt-1">
                    {discount}% discount from current price
                  </p>
                )}
                {offer >= currentPrice && (
                  <p className="text-sm text-red-600 mt-1">
                    Offer must be lower than current price
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Offer Duration
                </label>
                <select
                  value={offerDuration}
                  onChange={(e) => setOfferDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>

            {/* Offer Summary */}
            {offer > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Your Offer</span>
                  <span className="font-bold">{offerAmount} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Marketplace Fee (2.5%)</span>
                  <span>{(offer * 0.025).toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Network Fee</span>
                  <span>~0.01 ETH</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Required</span>
                  <span>{(offer + offer * 0.025 + 0.01).toFixed(4)} ETH</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Expires in {offerDuration} day
                  {offerDuration !== "1" ? "s" : ""}
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleMakeOffer}
                className="flex-1"
                disabled={
                  !offerAmount ||
                  parseFloat(offerAmount) <= 0 ||
                  parseFloat(offerAmount) >= currentPrice
                }
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
            </div>
          </div>
        );

      case "connecting":
        return (
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-blue-600" />
            <h3 className="text-xl font-bold">Connect Your Wallet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your Web3 wallet to create the offer
            </p>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </Button>
          </div>
        );

      case "signing":
        return (
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 mx-auto text-orange-600" />
            <h3 className="text-xl font-bold">Sign Offer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign the offer transaction in your wallet
            </p>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-800 border-yellow-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Waiting for signature...
            </Badge>
          </div>
        );

      case "processing":
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-xl font-bold">Creating Offer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your offer is being created on the blockchain. This may take a few
              minutes.
            </p>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-800 border-blue-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Processing on blockchain...
            </Badge>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Offer Created!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your offer of <strong>{offerAmount} ETH</strong> for{" "}
                <strong>{domain.domain}</strong> has been submitted
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span>Transaction Hash:</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded">
                  <span className="truncate">{txHash}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => txHash && copyToClipboard(txHash)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              The domain owner will be notified of your offer. You'll receive an
              email if they accept it.
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Etherscan
              </Button>
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <AlertCircle className="h-16 w-16 mx-auto text-red-600" />
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                Offer Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error ||
                  "An unexpected error occurred while creating your offer."}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setStep("form")} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Make Offer</DialogTitle>
          <DialogDescription className="sr-only">
            Make an offer on this tokenized domain
          </DialogDescription>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
