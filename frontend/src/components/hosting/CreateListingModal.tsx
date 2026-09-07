"use client";

import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Home,
  Users,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Trash2,
  Camera,
  DollarSign,
  Bath,
  Waves,
  Wind,
  Wifi,
  UtensilsCrossed,
  Car,
  Tv,
  Check,
  Building2,
  FileText,
  Lock,
  Eye,
} from "lucide-react";
import { Listing } from "@/types";
import { api } from "@/lib/api";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (listing: Listing) => void;
  hostId: number;
}

const PRESET_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=800&auto=format&fit=crop&q=80",
    title: "Sunset Balcony & Living",
    tag: "Balcony View",
  },
  {
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80",
    title: "Master Suite with King Bed",
    tag: "Master Bedroom",
  },
  {
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    title: "Modern Dining & Lounge",
    tag: "Living Room",
  },
  {
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    title: "Luxury Attached Bath & Shower",
    tag: "Attached Bathroom",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    title: "Rooftop Swimming Pool View",
    tag: "Swimming Pool",
  },
];

export default function CreateListingModal({
  isOpen,
  onClose,
  onSuccess,
  hostId,
}: CreateListingModalProps) {
  const { formatPrice, currentCurrency } = useLanguageCurrency();

  // Multi-step Wizard Step (1 to 7)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  // Step 1: Title, Property Type & Exact Address
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Flat");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [exactAddress, setExactAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [landmark, setLandmark] = useState("");

  // Step 2: Description & Highlights
  const [description, setDescription] = useState("");

  // Step 3: Capacity & Rooms
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [beds, setBeds] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);

  // Step 4: Attached Bathroom, Pool, Air Conditioning & Amenities
  const [hasAttachedBathroom, setHasAttachedBathroom] = useState<boolean>(false);
  const [hasPool, setHasPool] = useState<boolean>(false);
  const [hasAirConditioning, setHasAirConditioning] = useState<boolean>(false);
  const [amenitiesList, setAmenitiesList] = useState<string[]>(["Wifi"]);

  // Step 5: Photos of the stay
  const [photos, setPhotos] = useState<string[]>([PRESET_PHOTOS[0].url]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>("");

  // Step 6: Pricing & Fees
  const [pricePerNight, setPricePerNight] = useState<number>(3000);
  const [cleaningFee, setCleaningFee] = useState<number>(350);

  // Step 7: Identity Verification
  const [identityConfirmed, setIdentityConfirmed] = useState<boolean>(true);
  const [standardsAgreed, setStandardsAgreed] = useState<boolean>(true);

  if (!isOpen) return null;

  // Toggle amenity
  const toggleAmenity = (name: string) => {
    setAmenitiesList((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Add custom photo URL
  const handleAddPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    setPhotos((prev) => [...prev, customPhotoUrl.trim()]);
    setCustomPhotoUrl("");
  };

  // Remove photo
  const handleRemovePhoto = (idx: number) => {
    if (photos.length <= 1) {
      setErrorMsg("At least one photo is required.");
      return;
    }
    setErrorMsg(null);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Toggle preset photo
  const togglePresetPhoto = (url: string) => {
    setPhotos((prev) =>
      prev.includes(url)
        ? prev.length > 1
          ? prev.filter((u) => u !== url)
          : prev
        : [...prev, url]
    );
  };

  // Final Publish Handler
  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // Assemble full amenities array
      const finalAmenities = [...amenitiesList];
      if (hasAttachedBathroom && !finalAmenities.includes("Attached bathroom")) {
        finalAmenities.push("Attached bathroom");
      }
      if (hasPool && !finalAmenities.includes("Pool")) {
        finalAmenities.push("Pool");
      }
      if (hasAirConditioning && !finalAmenities.includes("Air conditioning")) {
        finalAmenities.push("Air conditioning");
      }

      if (!title.trim()) {
        setErrorMsg("Please provide a property title.");
        setIsSubmitting(false);
        return;
      }
      if (!city.trim()) {
        setErrorMsg("Please provide a city.");
        setIsSubmitting(false);
        return;
      }

      const formattedSubtitle = exactAddress.trim()
        ? `${exactAddress.trim()}, ${city.trim()}`
        : `Modern ${propertyType} in ${city.trim()}`;

      const bedDetailsText = `${bedrooms} bedrooms · ${beds} beds · ${bathrooms} bathrooms ${
        hasAttachedBathroom ? "(Attached)" : ""
      }`;

      const payload = {
        title: title.trim(),
        subtitle: formattedSubtitle,
        description: description.trim() || `Comfortable ${propertyType} in ${city.trim()}`,
        property_type: propertyType,
        category: "Homes",
        city: city.trim(),
        country: country.trim() || "India",
        latitude: 28.585,
        longitude: 77.365,
        price_per_night: Number(pricePerNight) || 3000,
        original_price: null,
        cleaning_fee: Number(cleaningFee) || 350,
        service_fee_percent: 14.0,
        max_guests: Number(maxGuests) || 4,
        bedrooms: Number(bedrooms) || 2,
        beds: Number(beds) || 2,
        bathrooms: Number(bathrooms) || 2,
        bed_details: bedDetailsText,
        amenities: finalAmenities,
        is_published: true,
        is_guest_favourite: false,
        images: photos.map((url, idx) => ({
          url,
          display_order: idx + 1,
          is_primary: idx === 0,
          caption: idx === 0 ? "Cover Photo" : undefined,
        })),
      };

      const serverListing = await api.createListing(payload, hostId || 2);

      const newListing: Listing = serverListing || {
        id: Date.now(),
        title: payload.title,
        subtitle: payload.subtitle,
        description: payload.description,
        propertyType: payload.property_type,
        category: payload.category,
        city: payload.city,
        country: payload.country,
        latitude: payload.latitude,
        longitude: payload.longitude,
        pricePerNight: payload.price_per_night,
        cleaningFee: payload.cleaning_fee,
        serviceFeePercent: 14,
        rating: 5.0,
        reviewCount: 0,
        maxGuests: payload.max_guests,
        bedrooms: payload.bedrooms,
        beds: payload.beds,
        bathrooms: payload.bathrooms,
        bedDetails: payload.bed_details,
        amenities: payload.amenities,
        images: payload.images.map((img, i) => ({
          id: i + 1,
          url: img.url,
          displayOrder: img.display_order,
          isPrimary: img.is_primary,
        })),
        hostId: hostId || 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
      };

      onSuccess(newListing);
      onClose();
    } catch (err: any) {
      console.error("Listing creation failed:", err);
      setErrorMsg("Failed to publish listing. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsMeta = [
    { num: 1, label: "Exact Address", icon: MapPin },
    { num: 2, label: "Description", icon: FileText },
    { num: 3, label: "Capacity", icon: Users },
    { num: 4, label: "Bath & Amenities", icon: Bath },
    { num: 5, label: "Photos", icon: Camera },
    { num: 6, label: "Price", icon: DollarSign },
    { num: 7, label: "Identity", icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              <h2 className="text-lg sm:text-xl font-extrabold text-[#222222]">
                Create New Listing
              </h2>
            </div>
            <p className="text-xs text-[#717171] mt-0.5">
              Step {step} of 7: {stepsMeta[step - 1].label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Step Pills */}
        <div className="bg-[#F7F7F7] border-b border-[#EBEBEB] px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {stepsMeta.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#222222] text-white shadow-xs"
                      : isPast
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-white text-[#717171] border border-[#DDDDDD] hover:text-[#222222]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                  {isPast && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Title, Property Type & Exact Address */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Where is your stay located?
                </h3>
                <p className="text-xs text-[#717171]">
                  Provide the title, property type, and exact street address for guests.
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Listing Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Panoramic Sunset Suite in Noida"
                  className="w-full border border-[#B0B0B0] rounded-xl p-3 text-sm font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                />
              </div>

              {/* Property Type Pills */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1.5">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Suite", "Apartment", "Entire home", "Villa", "Penthouse", "Studio"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPropertyType(t)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        propertyType === t
                          ? "bg-[#222222] text-white"
                          : "bg-[#F7F7F7] border border-[#DDDDDD] text-[#222222] hover:bg-[#EBEBEB]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#222222] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Noida"
                    className="w-full border border-[#B0B0B0] rounded-xl p-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222222] mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full border border-[#B0B0B0] rounded-xl p-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#222222]"
                  />
                </div>
              </div>

              {/* Exact Address */}
              <div className="p-3.5 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB] space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF385C]" />
                  <span className="text-xs font-bold text-[#222222]">
                    Exact Street Address & Landmark
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#717171] mb-1">
                    Street Address / Building / Tower
                  </label>
                  <input
                    type="text"
                    value={exactAddress}
                    onChange={(e) => setExactAddress(e.target.value)}
                    placeholder="e.g. Tower 4, Sector 62, Near Expressway"
                    className="w-full bg-white border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#717171] mb-1">
                      Postal Code / PIN Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 201309"
                      className="w-full bg-white border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#717171] mb-1">
                      Landmark / Area
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Cyber City"
                      className="w-full bg-white border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Description & Story */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Describe your stay to guests
                </h3>
                <p className="text-xs text-[#717171]">
                  Highlight what makes your place special, the view, interior design, and atmosphere.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Full Property Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share what makes this space unique: view, layout, tranquility..."
                  className="w-full border border-[#B0B0B0] rounded-2xl p-3 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222] leading-relaxed"
                />
                <span className="text-[11px] text-[#717171] mt-1 block">
                  {description.length} characters
                </span>
              </div>

              <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF385C] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#222222]">
                  <span className="font-bold">Host Tip:</span> Mentioning scenic sunset views, fast fiber WiFi, and private attached bathrooms increases booking rates by 34%!
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Capacity & Accommodates */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  How many persons can it accommodate?
                </h3>
                <p className="text-xs text-[#717171]">
                  Set guest limits, bedrooms, and beds. Base rate covers up to 2 guests.
                </p>
              </div>

              {/* Guest Stepper */}
              <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB]">
                <div>
                  <h4 className="font-bold text-sm text-[#222222]">Max Guests Accommodated</h4>
                  <p className="text-xs text-[#717171]">Total persons permitted to stay</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={maxGuests <= 1}
                    onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base min-w-[20px] text-center text-[#222222]">
                    {maxGuests}
                  </span>
                  <button
                    type="button"
                    disabled={maxGuests >= 16}
                    onClick={() => setMaxGuests(Math.min(16, maxGuests + 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bedrooms Stepper */}
              <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB]">
                <div>
                  <h4 className="font-bold text-sm text-[#222222]">Bedrooms</h4>
                  <p className="text-xs text-[#717171]">Private bedrooms available</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={bedrooms <= 1}
                    onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base min-w-[20px] text-center text-[#222222]">
                    {bedrooms}
                  </span>
                  <button
                    type="button"
                    disabled={bedrooms >= 10}
                    onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Beds Stepper */}
              <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB]">
                <div>
                  <h4 className="font-bold text-sm text-[#222222]">Beds</h4>
                  <p className="text-xs text-[#717171]">Total beds (King / Queen / Single)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={beds <= 1}
                    onClick={() => setBeds(Math.max(1, beds - 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base min-w-[20px] text-center text-[#222222]">
                    {beds}
                  </span>
                  <button
                    type="button"
                    disabled={beds >= 15}
                    onClick={() => setBeds(Math.min(15, beds + 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bathrooms Stepper */}
              <div className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB]">
                <div>
                  <h4 className="font-bold text-sm text-[#222222]">Bathrooms Count</h4>
                  <p className="text-xs text-[#717171]">Total bathrooms on property</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={bathrooms <= 1}
                    onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base min-w-[20px] text-center text-[#222222]">
                    {bathrooms}
                  </span>
                  <button
                    type="button"
                    disabled={bathrooms >= 10}
                    onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                    className="w-8 h-8 rounded-full border border-[#B0B0B0] flex items-center justify-center font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Attached Bathroom, Pool, Air Conditioning & Amenities */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Bathroom Type & Standout Features
                </h3>
                <p className="text-xs text-[#717171]">
                  Confirm if the bathroom is attached, plus pool and air conditioning availability.
                </p>
              </div>

              {/* Attached Bathroom Selection */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-2">
                  Attached Bathroom or Shared? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setHasAttachedBathroom(true)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      hasAttachedBathroom
                        ? "border-[#222222] bg-[#F7F7F7] shadow-xs"
                        : "border-[#EBEBEB] hover:border-[#DDDDDD] bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#222222]">Private Attached Bath</h4>
                        {hasAttachedBathroom && <Check className="w-4 h-4 text-[#222222]" />}
                      </div>
                      <p className="text-[11px] text-[#717171] mt-0.5">
                        Yes, ensuite attached directly to the bedroom.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setHasAttachedBathroom(false)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      !hasAttachedBathroom
                        ? "border-[#222222] bg-[#F7F7F7] shadow-xs"
                        : "border-[#EBEBEB] hover:border-[#DDDDDD] bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <DoorOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#222222]">Shared Bathroom</h4>
                        {!hasAttachedBathroom && <Check className="w-4 h-4 text-[#222222]" />}
                      </div>
                      <p className="text-[11px] text-[#717171] mt-0.5">
                        Located in the hallway or shared with others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pool & Air Conditioning Toggles */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-2">
                  Key Luxury Amenities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Pool Toggle */}
                  <div
                    onClick={() => setHasPool(!hasPool)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      hasPool
                        ? "border-[#008489] bg-cyan-50/40 shadow-xs"
                        : "border-[#EBEBEB] hover:border-[#DDDDDD] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                        <Waves className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#222222]">Swimming Pool</h4>
                        <p className="text-[11px] text-[#717171]">
                          {hasPool ? "Included / Private Access" : "Not available"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        hasPool ? "bg-[#008489] text-white border-[#008489]" : "border-[#B0B0B0]"
                      }`}
                    >
                      {hasPool && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Air Conditioning Toggle */}
                  <div
                    onClick={() => setHasAirConditioning(!hasAirConditioning)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      hasAirConditioning
                        ? "border-[#008489] bg-cyan-50/40 shadow-xs"
                        : "border-[#EBEBEB] hover:border-[#DDDDDD] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#222222]">Air Conditioning</h4>
                        <p className="text-[11px] text-[#717171]">
                          {hasAirConditioning ? "Climate Controlled AC" : "Not available"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        hasAirConditioning
                          ? "bg-[#008489] text-white border-[#008489]"
                          : "border-[#B0B0B0]"
                      }`}
                    >
                      {hasAirConditioning && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Amenities Selection */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1.5">
                  Other Popular Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: "Wifi", icon: Wifi },
                    { name: "Kitchen", icon: UtensilsCrossed },
                    { name: "Free parking", icon: Car },
                    { name: "Dedicated workspace", icon: Building2 },
                    { name: "TV", icon: Tv },
                    { name: "Self check-in", icon: Lock },
                  ].map((item) => {
                    const isSelected = amenitiesList.includes(item.name);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => toggleAmenity(item.name)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                          isSelected
                            ? "border-[#222222] bg-[#F7F7F7] text-[#222222]"
                            : "border-[#EBEBEB] text-[#717171] hover:border-[#DDDDDD]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 ml-auto text-[#222222]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Photos of the Stay */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Photos of your stay ({photos.length} selected)
                </h3>
                <p className="text-xs text-[#717171]">
                  High quality photos showcase your bedrooms, attached bath, view, and pool.
                </p>
              </div>

              {/* Quick Preset Pickers */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-2">
                  Curated Architectural Photos (Click to toggle)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_PHOTOS.map((preset) => {
                    const isSelected = photos.includes(preset.url);
                    return (
                      <div
                        key={preset.url}
                        onClick={() => togglePresetPhoto(preset.url)}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition ${
                          isSelected
                            ? "border-[#FF385C] shadow-md"
                            : "border-[#DDDDDD] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-24 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-2 flex flex-col justify-between">
                          <div className="self-end">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                isSelected ? "bg-[#FF385C] text-white" : "bg-white/80 text-[#222222]"
                              }`}
                            >
                              {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-white truncate">
                            {preset.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Photo URL Input */}
              <div className="p-3 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB] space-y-2">
                <label className="block text-[11px] font-bold text-[#222222]">
                  Add Custom Photo via URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-[#DDDDDD] rounded-xl p-2 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Photo Thumbnails */}
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1.5">
                  Listing Gallery Order (Image 1 is Primary Cover)
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#DDDDDD] flex-shrink-0 group"
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Pricing & Fees */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Set your price per night
                </h3>
                <p className="text-xs text-[#717171]">
                  You can change this anytime. Guests will see the nightly rate, cleaning fee, and 14% service fee.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222222] mb-1">
                    Nightly Price ({currentCurrency.code}) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm font-bold text-[#717171]">
                      {currentCurrency.symbol}
                    </span>
                    <input
                      type="number"
                      required
                      min={500}
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full border border-[#B0B0B0] rounded-xl pl-9 pr-3 py-2.5 text-base font-bold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#222222] mb-1">
                    Cleaning Fee ({currentCurrency.code})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm font-bold text-[#717171]">
                      {currentCurrency.symbol}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={cleaningFee}
                      onChange={(e) => setCleaningFee(Number(e.target.value))}
                      className="w-full border border-[#B0B0B0] rounded-xl pl-9 pr-3 py-2.5 text-base font-bold text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown Preview */}
              <div className="p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB] space-y-2 text-xs">
                <h4 className="font-bold text-xs text-[#222222] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
                  What guests pay for 1 night
                </h4>
                <div className="flex justify-between text-[#717171]">
                  <span>Nightly base rate:</span>
                  <span className="font-semibold text-[#222222]">{formatPrice(pricePerNight)}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span>Cleaning fee:</span>
                  <span className="font-semibold text-[#222222]">{formatPrice(cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span>Airbnb 14% Service fee:</span>
                  <span className="font-semibold text-[#222222]">
                    {formatPrice(Math.round(pricePerNight * 0.14))}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EBEBEB] flex justify-between font-bold text-sm text-[#222222]">
                  <span>Total Guest Price:</span>
                  <span className="font-extrabold text-[#FF385C]">
                    {formatPrice(pricePerNight + cleaningFee + Math.round(pricePerNight * 0.14))}
                  </span>
                </div>
                <div className="pt-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  Estimated host payout (after 3% host commission):{" "}
                  <span className="font-bold">{formatPrice(Math.round(pricePerNight * 0.97))}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Verification of Identity */}
          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#EBEBEB] pb-3">
                <h3 className="font-extrabold text-base text-[#222222]">
                  Host Identity Verification & Trust
                </h3>
                <p className="text-xs text-[#717171]">
                  Airbnb requires verified host credentials to safeguard guests and ensure authentic listings.
                </p>
              </div>

              {/* Host Identity Badge Card */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                        Identity Verified
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Host Account ID #{hostId || 2} · Sarah Jenkins
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-emerald-900 border-t border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Government Photo ID: Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Phone: +91 98765 43210 (SMS Verified)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Bank Payout Account: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Superhost Standards: Compliant</span>
                  </div>
                </div>
              </div>

              {/* Agreement Confirmation */}
              <div className="p-4 bg-[#F9F9F9] rounded-2xl border border-[#EBEBEB] space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={standardsAgreed}
                    onChange={(e) => setStandardsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#FF385C] rounded"
                  />
                  <span className="text-xs text-[#222222] font-medium leading-relaxed">
                    I certify that the address (<span className="font-bold">{exactAddress}, {city}</span>), photo gallery, bathroom specifications, and pool/AC descriptions are 100% accurate and comply with Airbnb host standards.
                  </span>
                </label>
              </div>

              {/* Summary Pill Preview */}
              <div className="p-3 bg-white rounded-2xl border border-[#DDDDDD] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#222222]">{title}</span>
                  <p className="text-[11px] text-[#717171]">
                    {maxGuests} guests · {bedrooms} bed · {bathrooms} bath {hasAttachedBathroom ? "(Attached)" : ""} · {hasPool ? "Pool" : ""} · {hasAirConditioning ? "AC" : ""}
                  </p>
                </div>
                <span className="font-extrabold text-sm text-[#222222]">
                  {formatPrice(pricePerNight)}/night
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-[#EBEBEB] flex items-center justify-between bg-white">
          <button
            type="button"
            disabled={step === 1 || isSubmitting}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDDDDD] text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {step < 7 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(7, s + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#222222] text-white text-xs font-bold hover:bg-black transition cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || !standardsAgreed}
                onClick={handlePublish}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DoorOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
      <path d="M2 20h20" />
      <path d="M13 20V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16" />
      <circle cx="10" cy="12" r="1" />
    </svg>
  );
}
