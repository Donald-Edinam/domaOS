"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CancelListingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    signature: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/orderbook/listing/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: formData.orderId,
          signature: formData.signature
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Listing cancelled successfully! Order ID: ${data.orderId}`);
        // Reset form
        setFormData({
          orderId: "",
          signature: ""
        });
      } else {
        const error = await response.json();
        toast.error(`Failed to cancel listing: ${error.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/orderbook">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orderbook
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cancel Listing</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Cancel Listing</CardTitle>
          <CardDescription>
            Cancel a listing on a supported orderbook (OpenSea, Doma)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Enter the Order ID to cancel"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">EIP-712 Signature</Label>
              <Input
                id="signature"
                placeholder="0x..."
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground">
                EIP-712 signature for cancel authorization
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full" variant="destructive">
              {loading ? "Cancelling Listing..." : "Cancel Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}