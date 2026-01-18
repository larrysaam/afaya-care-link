import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { specialties, cities, accreditations } from "@/data/hospitals";
import { useState } from "react";

interface FilterState {
  search: string;
  specialty: string;
  city: string;
  minRating: string;
  accreditation: string;
}

interface HospitalFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const HospitalFilters = ({ filters, onFilterChange }: HospitalFiltersProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      specialty: "",
      city: "",
      minRating: "",
      accreditation: "",
    });
  };

  const activeFilterCount = [
    filters.specialty,
    filters.city,
    filters.minRating,
    filters.accreditation,
  ].filter(Boolean).length;

  const FilterControls = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Select value={filters.specialty} onValueChange={(v) => updateFilter("specialty", v)}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="All Specialties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specialties</SelectItem>
          {specialties.map((specialty) => (
            <SelectItem key={specialty} value={specialty}>
              {specialty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="All Cities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.minRating} onValueChange={(v) => updateFilter("minRating", v)}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="Min Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Rating</SelectItem>
          <SelectItem value="4.5">4.5+ Stars</SelectItem>
          <SelectItem value="4.0">4.0+ Stars</SelectItem>
          <SelectItem value="3.5">3.5+ Stars</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.accreditation} onValueChange={(v) => updateFilter("accreditation", v)}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="Accreditation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Accreditations</SelectItem>
          {accreditations.map((acc) => (
            <SelectItem key={acc} value={acc}>
              {acc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, specialties, or cities..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-card border-border h-12"
          />
        </div>
        <Button
          variant="outline"
          className="lg:hidden h-12 px-4"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterControls />
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="pt-2">
              <FilterControls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.specialty && filters.specialty !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.specialty}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("specialty", "")}
              />
            </Badge>
          )}
          {filters.city && filters.city !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.city}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("city", "")} />
            </Badge>
          )}
          {filters.minRating && filters.minRating !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ Stars
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("minRating", "")}
              />
            </Badge>
          )}
          {filters.accreditation && filters.accreditation !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.accreditation}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter("accreditation", "")}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
