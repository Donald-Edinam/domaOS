"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, X, DollarSign, Eye } from "lucide-react";
import Link from "next/link";

export default function OrderbookPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orderbook</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Listing</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create a fixed price listing on supported orderbooks (OpenSea, Doma)
            </CardDescription>
            <Link href="/dashboard/orderbook/create-listing">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Listing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Offer</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create an offer on supported orderbooks (OpenSea, Doma)
            </CardDescription>
            <Link href="/dashboard/orderbook/create-offer">
              <Button className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancel Orders</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Cancel existing listings or offers
            </CardDescription>
            <div className="space-y-2">
              <Link href="/dashboard/orderbook/cancel-listing">
                <Button variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Listing
                </Button>
              </Link>
              <Link href="/dashboard/orderbook/cancel-offer">
                <Button variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Offer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Fees</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Check marketplace fees for different orderbooks and chains
            </CardDescription>
            <Link href="/dashboard/orderbook/fees">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View Fees
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}