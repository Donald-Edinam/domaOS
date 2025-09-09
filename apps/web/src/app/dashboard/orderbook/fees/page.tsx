"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FeesPage() {
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState<any>(null);
  const [formData, setFormData] = useState({
    orderbook: "opensea",
    chainId: "eip155:1",
    contractAddress: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/orderbook/fee/${formData.orderbook}/${formData.chainId}/${formData.contractAddress}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFees(data);
        toast.success("Fees retrieved successfully!");
      } else {
        const error = await response.json();
        toast.error(`Failed to get fees: ${error.error}`);
        setFees(null);
      }
    } catch (error) {
      toast.error("An error occurred while fetching fees");
      setFees(null);
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
        <h2 className="text-3xl font-bold tracking-tight">Orderbook Fees</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get Marketplace Fees</CardTitle>
            <CardDescription>
              Get marketplace fees for a specific orderbook and chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractAddress">Contract Address</Label>
                <Input
                  id="contractAddress"
                  placeholder="0x..."
                  value={formData.contractAddress}
                  onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Getting Fees..." : "Get Fees"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {fees && (
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Fees</CardTitle>
              <CardDescription>
                Current fees for {formData.orderbook} on {formData.chainId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.marketplaceFees && fees.marketplaceFees.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium">Fee Structure:</h4>
                    {fees.marketplaceFees.map((fee: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <pre className="text-sm overflow-auto">
                          {JSON.stringify(fee, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No marketplace fees found</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}