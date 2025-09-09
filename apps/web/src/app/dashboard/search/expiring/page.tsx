"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Globe,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BuyNowModal } from "@/components/buy-now-modal";
import { MakeOfferModal } from "@/components/make-offer-modal";

interface Domain {
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
  tokenId: string;
  contractAddress: string;
  chainId: string;
  orderbook: string;
}

const categories = [
  "All",
  "Productivity",
  "Finance",
  "AI/ML",
  "Sales",
  "Analytics",
  "Security",
];
const sortOptions = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Recently Expired", value: "recent" },
  { label: "Highest Traffic", value: "traffic" },
  { label: "Most Backlinks", value: "backlinks" },
];

export default function ExpiringDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [selectedCategory, sortBy]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCategory !== "All")
        params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/domains?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch domains");
      }

      const data = await response.json();
      setDomains(data.domains || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDomains();
  };

  const filteredDomains = domains.filter((domain) => {
    const matchesSearch =
      domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.originalSaasCategory
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            <h1 className="text-xl font-semibold">Expiring Domains</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-medium">Loading domains...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching expired SaaS domains from the blockchain
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
            <h1 className="text-xl font-semibold">Expiring Domains</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-12 text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Failed to Load Domains
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={fetchDomains}>Try Again</Button>
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
          <h1 className="text-xl font-semibold">Expiring Domains</h1>
        </div>
      </header>
      <div className="flex-1 p-6 pt-0 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Expiring SaaS Domains
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover high-quality tokenized domains from expired SaaS
                businesses
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDomains.length} domains found
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search domains or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Domain Grid */}
        {filteredDomains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <Card
                key={domain.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {domain.domain}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {domain.originalSaasCategory}
                      </p>
                    </div>
                    <Badge className={getStatusColor(domain.status)}>
                      {getStatusText(domain.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {domain.currentPrice}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {domain.usdPrice}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {domain.daysSinceExpired}d expired
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {domain.traffic}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {domain.backlinks.toLocaleString()} backlinks
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {domain.domainAge} old
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => {
                        setSelectedDomain(domain);
                        setShowBuyModal(true);
                      }}
                      disabled={domain.status !== "available"}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      onClick={() => {
                        setSelectedDomain(domain);
                        setShowOfferModal(true);
                      }}
                      disabled={domain.status !== "available"}
                    >
                      Make Offer
                    </Button>
                  </div>

                  <Button variant="ghost" className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="p-12 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No domains found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {domains.length === 0
                ? "No expired domains are currently available. Check back later for new listings."
                : "Try adjusting your search terms or filters"}
            </p>
            <Button onClick={fetchDomains}>Refresh</Button>
          </Card>
        )}

        {/* Modals */}
        {selectedDomain && (
          <>
            <BuyNowModal
              domain={selectedDomain}
              isOpen={showBuyModal}
              onClose={() => {
                setShowBuyModal(false);
                setSelectedDomain(null);
              }}
            />
            <MakeOfferModal
              domain={selectedDomain}
              isOpen={showOfferModal}
              onClose={() => {
                setShowOfferModal(false);
                setSelectedDomain(null);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
