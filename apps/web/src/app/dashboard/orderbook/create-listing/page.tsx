"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderbook: "opensea",
    chainId: "eip155:1",
    offerer: "",
    zone: "",
    orderType: 0,
    startTime: "",
    endTime: "",
    zoneHash: "",
    salt: "",
    signature: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/orderbook/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderbook: formData.orderbook,
          chainId: formData.chainId,
          parameters: {
            offerer: formData.offerer,
            zone: formData.zone,
            orderType: formData.orderType,
            startTime: formData.startTime,
            endTime: formData.endTime,
            zoneHash: formData.zoneHash,
            salt: formData.salt,
            offer: [],
            consideration: [],
            totalOriginalConsiderationItems: 0,
            conduitKey: "0x0000000000000000000000000000000000000000000000000000000000000000",
            counter: "0"
          },
          signature: formData.signature
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Listing created successfully! Order ID: ${data.orderId}`);
        // Reset form
        setFormData({
          orderbook: "opensea",
          chainId: "eip155:1",
          offerer: "",
          zone: "",
          orderType: 0,
          startTime: "",
          endTime: "",
          zoneHash: "",
          salt: "",
          signature: ""
        });
      } else {
        const error = await response.json();
        toast.error(`Failed to create listing: ${error.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while creating the listing");
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
        <h2 className="text-3xl font-bold tracking-tight">Create Listing</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create Fixed Price Listing</CardTitle>
          <CardDescription>
            Create a fixed priced listing on a supported orderbook (OpenSea, Doma)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderbook">Orderbook</Label>
                <select
                  id="orderbook"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.orderbook}
                  onChange={(e) => setFormData({ ...formData, orderbook: e.target.value })}
                >
                  <option value="opensea">OpenSea</option>
                  <option value="doma">Doma</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chainId">Chain ID</Label>
                <Input
                  id="chainId"
                  placeholder="eip155:1"
                  value={formData.chainId}
                  onChange={(e) => setFormData({ ...formData, chainId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerer">Offerer Address</Label>
              <Input
                id="offerer"
                placeholder="0x..."
                value={formData.offerer}
                onChange={(e) => setFormData({ ...formData, offerer: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Zone Address</Label>
              <Input
                id="zone"
                placeholder="0x..."
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time (Unix timestamp)</Label>
                <Input
                  id="startTime"
                  placeholder="1640995200"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time (Unix timestamp)</Label>
                <Input
                  id="endTime"
                  placeholder="1672531200"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">Order Signature</Label>
              <Input
                id="signature"
                placeholder="0x..."
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Listing..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}