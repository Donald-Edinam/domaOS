"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Clock,
  TrendingUp,
  Link as LinkIcon,
  Shield,
  DollarSign,
  Calendar,
  BarChart,
  Users,
  Eye,
  ExternalLink,
  Heart,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BuyNowModal } from "@/components/buy-now-modal";
import { MakeOfferModal } from "@/components/make-offer-modal";

interface DomainDetails {
  id: string;
  domain: string;
  category: string;
  expiryDate: string;
  currentPrice: string;
  usdPrice: string;
  daysSinceExpired: number;
  originalSaasCategory: string;
  traffic: string;
  backlinks: number;
  domainAge: string;
  isTokenized: boolean;
  status: string;
  description: string;
  tokenId: string;
  contractAddress: string;
  chainId: string;
  orderbook: string;
  originalFounders: string;
  shutdownReason: string;
  technologies: string[];
  keyFeatures: string[];
  seoMetrics: {
    domainAuthority: number;
    organicKeywords: number;
    monthlyOrganicTraffic: string;
    topKeywords: string[];
  };
  socialMetrics: {
    facebookShares: number;
    twitterMentions: number;
    linkedinShares: number;
  };
  financialHistory: {
    lastKnownRevenue: string;
    peakRevenue: string;
    customerBase: string;
  };
}

export default function DomainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [domain, setDomain] = useState<DomainDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const domainId = params.id as string;

  useEffect(() => {
    if (domainId) {
      fetchDomainDetails(domainId);
    }
  }, [domainId]);

  const fetchDomainDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/domains/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Domain not found");
        }
        throw new Error("Failed to fetch domain details");
      }

      const data = await response.json();
      setDomain(data.domain);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "offer_pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "sold":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "offer_pending":
        return "Offer Pending";
      case "sold":
        return "Sold";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Domain Details</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-medium">Loading domain details...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching domain information from the blockchain
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Domain Details</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-12 text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {error === "Domain not found"
                ? "Domain Not Found"
                : "Error Loading Domain"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error === "Domain not found"
                ? "The requested domain could not be found or may have been removed."
                : error}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              {error !== "Domain not found" && (
                <Button onClick={() => fetchDomainDetails(domainId)}>
                  Try Again
                </Button>
              )}
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (!domain) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Domain Details</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-12 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Domain Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No domain information is currently available.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{domain.domain}</h1>
        </div>
      </header>

      <div className="flex-1 p-6 pt-0 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-600" />
              {domain.domain}
              <Badge className={getStatusColor(domain.status)}>
                {getStatusText(domain.status)}
              </Badge>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {domain.originalSaasCategory} • Expired {domain.daysSinceExpired}{" "}
              days ago
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Domain
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {domain.description}
                </p>
              </CardContent>
            </Card>

            {/* SEO Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  SEO Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {domain.seoMetrics.domainAuthority}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Domain Authority
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {domain.seoMetrics.organicKeywords.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Organic Keywords
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {domain.seoMetrics.monthlyOrganicTraffic}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly Traffic
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {domain.backlinks.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Backlinks
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Top Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {domain.seoMetrics.topKeywords.map(
                      (keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Core Features:</h4>
                    <ul className="space-y-2">
                      {domain.keyFeatures.map(
                        (feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            {feature}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {domain.technologies.map(
                        (tech: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Last Known Revenue
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {domain.financialHistory.lastKnownRevenue}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Peak Revenue
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {domain.financialHistory.peakRevenue}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Customer Base
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {domain.financialHistory.customerBase}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {domain.currentPrice}
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    {domain.usdPrice}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Current market price
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowBuyModal(true)}
                    disabled={domain.status !== "available"}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setShowOfferModal(true)}
                    disabled={domain.status !== "available"}
                  >
                    Make Offer
                  </Button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Secured by blockchain • NFT ownership
                </div>
              </CardContent>
            </Card>

            {/* Domain Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Domain Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Domain Age
                  </span>
                  <span className="font-medium">{domain.domainAge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-red-500" />
                    Days Expired
                  </span>
                  <span className="font-medium">
                    {domain.daysSinceExpired} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Monthly Traffic
                  </span>
                  <span className="font-medium">{domain.traffic}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-blue-500" />
                    Backlinks
                  </span>
                  <span className="font-medium">
                    {domain.backlinks.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-purple-500" />
                    Token ID
                  </span>
                  <span className="font-medium text-xs">
                    {domain.tokenId.slice(0, 10)}...
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Historical Info */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Original Company
                  </div>
                  <div className="font-medium">{domain.originalFounders}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Shutdown Reason
                  </div>
                  <div className="font-medium">{domain.shutdownReason}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Expiry Date
                  </div>
                  <div className="font-medium">{domain.expiryDate}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <BuyNowModal
          domain={domain}
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
        />
        <MakeOfferModal
          domain={domain}
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
        />
      </div>
    </>
  );
}
