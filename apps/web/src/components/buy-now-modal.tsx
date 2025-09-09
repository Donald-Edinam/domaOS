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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuyNowModalProps {
  domain: any;
  isOpen: boolean;
  onClose: () => void;
}

type PurchaseStep =
  | "confirm"
  | "connecting"
  | "fetching"
  | "signing"
  | "processing"
  | "success"
  | "error";

export function BuyNowModal({ domain, isOpen, onClose }: BuyNowModalProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [step, setStep] = useState<PurchaseStep>("confirm");
  const [fulfillmentData, setFulfillmentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      setStep("confirm");
      setFulfillmentData(null);
      setError(null);
      setTxHash(null);
      setUserWalletAddress(null);
    }
  }, [isOpen]);

  const connectWallet = async (): Promise<string> => {
    // Check if Web3 provider is available
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        // Request wallet connection
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
    } else {
      throw new Error(
        "Web3 wallet not found. Please install MetaMask or another Web3 wallet.",
      );
    }
  };

  const executeTransaction = async (
    fulfillmentData: any,
    walletAddress: string,
  ): Promise<string> => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        // This is where you would implement the actual blockchain transaction
        // using the fulfillment data from the Doma API

        // Example transaction structure (this would be replaced with actual implementation):
        /*
        const transactionParameters = {
          to: fulfillmentData.parameters.zone, // Contract address
          from: walletAddress,
          value: '0x' + parseInt(fulfillmentData.parameters.consideration[0].startAmount).toString(16),
          data: fulfillmentData.signature, // Contract method call data
        };

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        return txHash;
        */

        // For now, throw an error to indicate this needs real implementation
        throw new Error(
          "Real blockchain transaction implementation required. " +
            "Please integrate with actual smart contracts and Web3 provider. " +
            "Fulfillment data is ready for use.",
        );
      } catch (error) {
        throw new Error(
          "Transaction failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
      }
    } else {
      throw new Error("Web3 provider not available");
    }
  };

  const handleBuyNow = async () => {
    try {
      setError(null);

      // Step 1: Connect wallet
      setStep("connecting");
      const walletAddress = await connectWallet();
      setUserWalletAddress(walletAddress);

      // Step 2: Get fulfillment data from Doma API
      setStep("fetching");
      const fulfillmentResponse = await fetch(
        `/api/orderbook/listing/${domain.tokenId}/${walletAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!fulfillmentResponse.ok) {
        const errorData = await fulfillmentResponse.json();
        throw new Error(errorData.error || "Failed to get fulfillment data");
      }

      const fulfillmentData = await fulfillmentResponse.json();
      setFulfillmentData(fulfillmentData);

      // Step 3: Execute transaction
      setStep("signing");
      const transactionHash = await executeTransaction(
        fulfillmentData,
        walletAddress,
      );
      setTxHash(transactionHash);

      // Step 4: Wait for confirmation
      setStep("processing");
      // In real implementation, you would wait for blockchain confirmation here

      setStep("success");
      toast({
        title: "Purchase Successful!",
        description: `You now own ${domain.domain}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
      toast({
        title: "Purchase Failed",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or contact support",
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
      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Purchase {domain.domain}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're about to purchase this tokenized domain
              </p>
            </div>

            {/* Purchase Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span>Domain Price</span>
                <span className="font-bold">{domain.currentPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>USD Equivalent</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {domain.usdPrice}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>Marketplace Fee (2.5%)</span>
                <span>~2.5% of price</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Network Fee</span>
                <span>Variable (gas fees)</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{domain.currentPrice} + fees</span>
              </div>
            </div>

            {/* Ownership Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium">What you'll own:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Full domain ownership rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>NFT certificate of ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Historical SaaS data and analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Resale rights on marketplace</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBuyNow} className="flex-1">
                <Wallet className="h-4 w-4 mr-2" />
                Buy Now
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
              Please connect your Web3 wallet to complete the purchase
            </p>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </Button>
          </div>
        );

      case "fetching":
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-xl font-bold">Getting Order Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching the latest order information from Doma API...
            </p>
          </div>
        );

      case "signing":
        return (
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 mx-auto text-orange-600" />
            <h3 className="text-xl font-bold">Sign Transaction</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign the transaction in your wallet to complete the
              purchase
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
            <h3 className="text-xl font-bold">Processing Transaction</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your transaction is being processed on the blockchain. This may
              take a few minutes.
            </p>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-800 border-blue-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Confirming on blockchain...
            </Badge>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Purchase Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Congratulations! You now own <strong>{domain.domain}</strong>
              </p>
            </div>

            {txHash && (
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
                      onClick={() => copyToClipboard(txHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {txHash && (
                <Button variant="outline" onClick={onClose} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </Button>
              )}
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
                Purchase Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setStep("confirm")} className="flex-1">
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
          <DialogTitle className="sr-only">Buy Domain</DialogTitle>
          <DialogDescription className="sr-only">
            Purchase this tokenized domain
          </DialogDescription>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
