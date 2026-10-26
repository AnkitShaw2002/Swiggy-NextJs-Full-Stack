"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRestaurantStore } from "@/features/store/restaurantOwner.store";
import { Restaurant, RestaurantDetailsApiPayload } from "@/features/typescript/restaurantOwner.type";
import {
  BasicDetailsFormValues,
  DocumentsFormValues,
  ContractFormValues,
} from "@/features/validation/restaurantOnboarding.schema";

// ---------------------------------------------------------------------------
// Partner apply (app/(resturant_owner)/apply/page.tsx)
// ---------------------------------------------------------------------------

const APPLY_BG_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop";

type ErrWithApiMessage = {
  response?: { data?: { message?: string } };
  message?: string;
};

const asApiError = (err: unknown) => err as ErrWithApiMessage | null | undefined;

export function useApplyRestaurantPage() {
  const router = useRouter();
  const { applyRestaurant, verifyOtp, resendOtp } = useRestaurantStore();

  const [step, setStep] = useState<"hero" | "otp">("hero");
  const [contactEmail, setContactEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceType, setServiceType] = useState<"delivery" | "dineout">("delivery");

  // Auto-fill email from localStorage auth state on mount
  useEffect(() => {
    // Only access localStorage on the client side. Reading it after mount (not
    // in a lazy state initializer) keeps server and first client render equal.
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // Access the email nested in state.user based on your provided structure
          const email = parsed?.state?.user?.email;
          if (email) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setContactEmail(email);
          }
        } catch (err) {
          console.error("Failed to parse auth-storage:", err);
        }
      }
    }
  }, []); // Run only once when the component mounts

  const handleHeroSubmit = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await applyRestaurant({ email });
      setContactEmail(email);
      setUserId(res?.id || email);
      setStep("otp");
    } catch (err) {
      const msg =
        asApiError(err)?.response?.data?.message ||
        asApiError(err)?.message ||
        "Failed to send OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setLoading(true);
    setError("");
    try {
      await verifyOtp({ email: contactEmail, otp });
      router.push("/onboarding");
    } catch (err) {
      const msg = asApiError(err)?.response?.data?.message || "Invalid OTP";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // applyRestaurant rejects with "application already exists" while the OTP
    // step is open and never sends a new code - the dedicated resend endpoint
    // is the one that actually emails a fresh OTP. Let failures propagate so
    // the card keeps its old countdown instead of pretending it was resent.
    await resendOtp({ email: contactEmail });
  };

  return {
    bgImage: APPLY_BG_IMAGE,
    step,
    setStep,
    contactEmail,
    userId,
    loading,
    error,
    serviceType,
    setServiceType,
    handleHeroSubmit,
    handleOtpVerify,
    handleResend,
  };
}

// ---------------------------------------------------------------------------
// Application success (app/(resturant_owner)/success/page.tsx)
// ---------------------------------------------------------------------------

export function useSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success(
      "Application submitted successfully! Please wait for admin approval."
    );
  }, []);

  const handleBackHome = () => router.push("/");

  return { handleBackHome };
}

// ---------------------------------------------------------------------------
// Onboarding wizard (app/(resturant_owner)/onboarding/page.tsx)
// ---------------------------------------------------------------------------

// Helper mapper for Step 1: Basic Details
const getDetailsInitialData = (
  restaurant: Restaurant | null
): Partial<BasicDetailsFormValues> | undefined => {
  if (!restaurant) return undefined;

  const loc = restaurant.location;
  const locationData =
    typeof loc === "object" && loc !== null
      ? {
          address: loc.address || "",
          city: loc.city || "",
          state: loc.state || "",
          pincode: loc.pincode || "",
        }
      : typeof loc === "string"
      ? { address: loc, city: "", state: "", pincode: "" }
      : { address: "", city: "", state: "", pincode: "" };

  return {
    ownerName: restaurant.ownerName || "",
    restaurantName: restaurant.restaurantName || "",
    location: locationData,
    email: restaurant.email || "",
    phone: restaurant.phone || "",
    whatsappNumber: restaurant.whatsappNumber || "",
    workingDays: Array.isArray(restaurant.workingDays)
      ? restaurant.workingDays.map((d) => (typeof d === "string" ? d : d.day))
      : undefined,
    openingClosing: {
      open: restaurant.openingClosing?.open || "09:00",
      close: restaurant.openingClosing?.close || "23:00",
    },
  };
};

// Helper mapper for Step 2: Documents
const getDocumentsInitialData = (
  restaurant: Restaurant | null
): Partial<DocumentsFormValues> | undefined => {
  if (!restaurant) return undefined;

  return {
    outletType: restaurant.outletType || "Restaurant",
    pan: restaurant.pan || restaurant.panNumber || "",
    gstin: restaurant.gstin || "",
    ifscCode: restaurant.ifscCode || "",
    bankAccountNumber: restaurant.bankAccountNumber || "",
    fssaiNumber: restaurant.fssaiNumber || "",
  };
};

// Helper mapper for Step 3: Contract
const getContractInitialData = (
  restaurant: Restaurant | null
): Partial<ContractFormValues> | undefined => {
  if (!restaurant) return undefined;

  const loc = restaurant.location;

  const city =
    typeof loc === "object" && loc?.city
      ? loc.city
      : typeof loc === "string"
      ? loc
      : "";

  return {
    fullName: restaurant.ownerName || "",
    designation: "Owner",
    date: restaurant.updatedAt
      ? new Date(restaurant.updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    place: city,
    declarationAccepted: true as const,
    reviewedSections: [
      "terms_of_service",
      "commission_payment_terms",
      "operational_guidelines",
      "privacy_data_policy",
    ],
  };
};

export const ONBOARDING_STEPS = [
  { id: 1, label: "Restaurant Information" },
  { id: 2, label: "Restaurant Documents" },
  { id: 3, label: "Partner Contract" },
];

export function useOnboardingPage() {
  const router = useRouter();
  const {
    restaurant,
    currentStep,
    isLoading,
    fetchMyRestaurant,
    saveRestaurantDetails,
    saveRestaurantDocuments,
    acceptPartnerContract,
    nextStep,
    prevStep,
  } = useRestaurantStore();

  useEffect(() => {
    fetchMyRestaurant();
  }, [fetchMyRestaurant]);

  // Handlers for steps
  const handleDetailsSubmit = async (data: BasicDetailsFormValues) => {
    try {
      const payload: RestaurantDetailsApiPayload = {
        ownerName: data.ownerName,
        restaurantName: data.restaurantName,
        location: `${data.location.address}, ${data.location.city}, ${data.location.state} - ${data.location.pincode}`,
        email: data.email,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        workingDays: data.workingDays.map((d) => d.toLowerCase()),
        openingClosing: {
          sameForAllDays: true,
          slots: [
            { open: data.openingClosing.open, close: data.openingClosing.close },
          ],
        },
      };
      await saveRestaurantDetails(payload);
      nextStep();
    } catch (error) {
      console.error("Details Save Error:", error);
    }
  };

  const handleDocumentsSubmit = async (data: DocumentsFormValues) => {
    try {
      await saveRestaurantDocuments(data);
      nextStep();
    } catch (error) {
      console.error("Document Save Error:", error);
    }
  };

  const handleContractSubmit = async (data: ContractFormValues) => {
    try {
      await acceptPartnerContract(data);
      router.push("/success");
    } catch (error) {
      console.error("Contract Submit Error:", error);
    }
  };

  return {
    currentStep,
    isLoading,
    prevStep,
    steps: ONBOARDING_STEPS,
    detailsInitialData: getDetailsInitialData(restaurant),
    documentsInitialData: getDocumentsInitialData(restaurant),
    contractInitialData: getContractInitialData(restaurant),
    handleDetailsSubmit,
    handleDocumentsSubmit,
    handleContractSubmit,
  };
}
