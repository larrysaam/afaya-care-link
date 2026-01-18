// Mock hospital data for the marketplace

export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  accreditations: string[];
  description: string;
  established: number;
  beds: number;
  doctors: number;
  image: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  features: string[];
  internationalPatients: number;
  successRate: number;
  avgCostSavings: number;
}

export const specialties = [
  "Cardiology",
  "Oncology",
  "Orthopedics",
  "Neurology",
  "Urology",
  "Gastroenterology",
  "Nephrology",
  "Pulmonology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Pediatrics",
  "Gynecology",
  "Dental",
  "Cosmetic Surgery",
  "Bariatric Surgery",
  "Fertility Treatment",
  "Transplant Surgery",
];

export const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Kochi",
  "Jaipur",
];

export const accreditations = [
  "JCI Accredited",
  "NABH Accredited",
  "NABL Certified",
  "ISO 9001:2015",
  "Green OT Certified",
];

export const hospitals: Hospital[] = [
  {
    id: "apollo-chennai",
    name: "Apollo Hospitals",
    city: "Chennai",
    state: "Tamil Nadu",
    rating: 4.8,
    reviewCount: 2450,
    specialties: ["Cardiology", "Oncology", "Orthopedics", "Neurology", "Transplant Surgery"],
    accreditations: ["JCI Accredited", "NABH Accredited", "NABL Certified"],
    description: "Apollo Hospitals Chennai is one of Asia's foremost integrated healthcare centres. Known for pioneering heart surgeries and transplants, it offers world-class medical care with cutting-edge technology and internationally trained physicians.",
    established: 1983,
    beds: 560,
    doctors: 350,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop",
    address: "21, Greams Lane, Off Greams Road, Chennai - 600006",
    phone: "+91-44-2829-3333",
    email: "intl.patient@apollohospitals.com",
    website: "www.apollohospitals.com",
    features: ["24/7 Emergency", "International Patient Lounge", "Video Consultation", "Airport Pickup", "Translator Services", "Visa Assistance"],
    internationalPatients: 15000,
    successRate: 98,
    avgCostSavings: 70,
  },
  {
    id: "fortis-delhi",
    name: "Fortis Memorial Research Institute",
    city: "Delhi",
    state: "Delhi NCR",
    rating: 4.7,
    reviewCount: 1890,
    specialties: ["Cardiology", "Oncology", "Neurology", "Gastroenterology", "Nephrology"],
    accreditations: ["JCI Accredited", "NABH Accredited", "ISO 9001:2015"],
    description: "Fortis Memorial Research Institute in Gurugram is a multi-super specialty, quaternary care hospital with a strength of 1000 beds. It is one of the best private hospitals in India for advanced cardiac care and cancer treatment.",
    established: 2001,
    beds: 1000,
    doctors: 450,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop",
    address: "Sector-44, Opposite HUDA City Centre, Gurugram - 122002",
    phone: "+91-124-496-2222",
    email: "international@fortishealthcare.com",
    website: "www.fortishealthcare.com",
    features: ["24/7 Emergency", "Robotic Surgery", "International Patient Services", "Dedicated Coordinators", "Language Support"],
    internationalPatients: 12000,
    successRate: 97,
    avgCostSavings: 65,
  },
  {
    id: "medanta-gurugram",
    name: "Medanta - The Medicity",
    city: "Delhi",
    state: "Delhi NCR",
    rating: 4.9,
    reviewCount: 3200,
    specialties: ["Cardiology", "Oncology", "Orthopedics", "Neurology", "Transplant Surgery", "Bariatric Surgery"],
    accreditations: ["JCI Accredited", "NABH Accredited", "NABL Certified", "Green OT Certified"],
    description: "Medanta - The Medicity is one of India's largest multi-specialty hospitals, founded by renowned cardiac surgeon Dr. Naresh Trehan. It offers advanced medical technology and has successfully performed over 50,000 cardiac surgeries.",
    established: 2009,
    beds: 1600,
    doctors: 800,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&h=100&fit=crop",
    address: "CH Baktawar Singh Road, Sector 38, Gurugram - 122001",
    phone: "+91-124-414-1414",
    email: "intlpatients@medanta.org",
    website: "www.medanta.org",
    features: ["24/7 Emergency", "Robotic Surgery", "Da Vinci Surgical System", "International Lounge", "Visa Assistance", "Accommodation Support"],
    internationalPatients: 20000,
    successRate: 99,
    avgCostSavings: 75,
  },
  {
    id: "max-saket",
    name: "Max Super Specialty Hospital",
    city: "Delhi",
    state: "Delhi NCR",
    rating: 4.6,
    reviewCount: 1560,
    specialties: ["Cardiology", "Oncology", "Neurology", "Urology", "Gastroenterology"],
    accreditations: ["NABH Accredited", "NABL Certified", "ISO 9001:2015"],
    description: "Max Super Specialty Hospital, Saket is a state-of-the-art quaternary care hospital offering comprehensive medical services. Known for its excellence in cardiac care and minimally invasive surgeries.",
    established: 2006,
    beds: 500,
    doctors: 280,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=100&h=100&fit=crop",
    address: "1, 2, Press Enclave Road, Saket, New Delhi - 110017",
    phone: "+91-11-2651-5050",
    email: "international.patients@maxhealthcare.com",
    website: "www.maxhealthcare.in",
    features: ["24/7 Emergency", "Advanced Diagnostics", "International Patient Desk", "Travel Assistance"],
    internationalPatients: 8000,
    successRate: 96,
    avgCostSavings: 60,
  },
  {
    id: "manipal-bangalore",
    name: "Manipal Hospitals",
    city: "Bangalore",
    state: "Karnataka",
    rating: 4.7,
    reviewCount: 2100,
    specialties: ["Orthopedics", "Oncology", "Neurology", "Fertility Treatment", "Cosmetic Surgery"],
    accreditations: ["JCI Accredited", "NABH Accredited", "NABL Certified"],
    description: "Manipal Hospitals Bangalore is a premier healthcare destination offering world-class medical facilities. It is renowned for its excellence in orthopedic surgery, cancer care, and assisted reproductive technology.",
    established: 1991,
    beds: 650,
    doctors: 380,
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&h=100&fit=crop",
    address: "98, HAL Airport Road, Bangalore - 560017",
    phone: "+91-80-2502-4444",
    email: "international@manipalhospitals.com",
    website: "www.manipalhospitals.com",
    features: ["24/7 Emergency", "Advanced Robotics", "International Services", "Guest Relations", "Visa Support"],
    internationalPatients: 10000,
    successRate: 97,
    avgCostSavings: 65,
  },
  {
    id: "narayana-bangalore",
    name: "Narayana Health City",
    city: "Bangalore",
    state: "Karnataka",
    rating: 4.8,
    reviewCount: 2800,
    specialties: ["Cardiology", "Oncology", "Nephrology", "Transplant Surgery", "Pediatrics"],
    accreditations: ["JCI Accredited", "NABH Accredited", "ISO 9001:2015", "Green OT Certified"],
    description: "Narayana Health City is a multi-specialty hospital known for providing affordable world-class healthcare. Founded by Dr. Devi Shetty, it has performed the highest number of heart surgeries in the world.",
    established: 2001,
    beds: 3000,
    doctors: 600,
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=100&h=100&fit=crop",
    address: "258/A, Bommasandra Industrial Area, Bangalore - 560099",
    phone: "+91-80-7122-2222",
    email: "intl@narayanahealth.org",
    website: "www.narayanahealth.org",
    features: ["24/7 Emergency", "Heart Surgery Excellence", "Affordable Care", "International Desk", "Telemedicine"],
    internationalPatients: 25000,
    successRate: 98,
    avgCostSavings: 80,
  },
  {
    id: "aster-kochi",
    name: "Aster Medcity",
    city: "Kochi",
    state: "Kerala",
    rating: 4.6,
    reviewCount: 1450,
    specialties: ["Cardiology", "Orthopedics", "Gastroenterology", "Pulmonology", "Dermatology"],
    accreditations: ["JCI Accredited", "NABH Accredited", "NABL Certified"],
    description: "Aster Medcity is Kerala's largest multi-specialty quaternary care hospital. Located in Kochi, it offers comprehensive healthcare services with international standards and personalized care.",
    established: 2014,
    beds: 670,
    doctors: 320,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop",
    address: "Kuttisahib Road, Cheranalloor, Kochi - 682027",
    phone: "+91-484-669-9999",
    email: "international@asterhospitals.com",
    website: "www.astermedcity.com",
    features: ["24/7 Emergency", "Modern Infrastructure", "International Patient Care", "Travel Coordination"],
    internationalPatients: 6000,
    successRate: 96,
    avgCostSavings: 70,
  },
  {
    id: "kokilaben-mumbai",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.8,
    reviewCount: 2650,
    specialties: ["Oncology", "Neurology", "Cardiology", "Transplant Surgery", "Ophthalmology"],
    accreditations: ["JCI Accredited", "NABH Accredited", "NABL Certified", "ISO 9001:2015"],
    description: "Kokilaben Dhirubhai Ambani Hospital is one of India's most advanced tertiary care facilities. It houses Asia's first fully automated laboratory and offers cutting-edge treatment across all major specialties.",
    established: 2009,
    beds: 750,
    doctors: 400,
    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&h=100&fit=crop",
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West, Mumbai - 400053",
    phone: "+91-22-3069-6969",
    email: "intlpatient@kokilabenhospital.com",
    website: "www.kokilabenhospital.com",
    features: ["24/7 Emergency", "Robotic Surgery", "Advanced Diagnostics", "VIP Suites", "Concierge Services", "Visa Assistance"],
    internationalPatients: 11000,
    successRate: 98,
    avgCostSavings: 60,
  },
];

export const getHospitalById = (id: string): Hospital | undefined => {
  return hospitals.find((h) => h.id === id);
};

export const filterHospitals = (
  filters: {
    specialty?: string;
    city?: string;
    minRating?: number;
    accreditation?: string;
    search?: string;
  }
): Hospital[] => {
  return hospitals.filter((hospital) => {
    if (filters.specialty && !hospital.specialties.includes(filters.specialty)) {
      return false;
    }
    if (filters.city && hospital.city !== filters.city) {
      return false;
    }
    if (filters.minRating && hospital.rating < filters.minRating) {
      return false;
    }
    if (filters.accreditation && !hospital.accreditations.includes(filters.accreditation)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        hospital.name.toLowerCase().includes(searchLower) ||
        hospital.city.toLowerCase().includes(searchLower) ||
        hospital.specialties.some((s) => s.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });
};
