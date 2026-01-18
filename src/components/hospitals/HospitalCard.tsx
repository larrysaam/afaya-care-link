import { Star, MapPin, Award, Bed, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Hospital } from "@/data/hospitals";

interface HospitalCardProps {
  hospital: Hospital;
  index: number;
}

export const HospitalCard = ({ hospital, index }: HospitalCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 border-border/50">
        <div className="relative h-48 overflow-hidden">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-semibold text-sm text-foreground">{hospital.rating}</span>
            <span className="text-xs text-muted-foreground">({hospital.reviewCount})</span>
          </div>

          {/* Location */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-primary-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{hospital.city}, {hospital.state}</span>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {hospital.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {hospital.description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-primary" />
              <span>{hospital.beds} beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>{hospital.doctors} doctors</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5">
            {hospital.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {hospital.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hospital.specialties.length - 3} more
              </Badge>
            )}
          </div>

          {/* Accreditations */}
          <div className="flex items-center gap-2 flex-wrap">
            {hospital.accreditations.slice(0, 2).map((acc) => (
              <div key={acc} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="w-3.5 h-3.5 text-accent" />
                <span>{acc}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="default" className="flex-1">
              <Link to={`/hospitals/${hospital.id}`}>View Profile</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              Request Consult
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
