"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AdminProfileCard from "@/components/admin/settings/AdminProfileCard";
import PricingSettingsCard from "@/components/admin/settings/PricingSettingsCard";
import SecurityCard from "@/components/admin/settings/SecurityCard";
import ShippingSettingsCard from "@/components/admin/settings/ShippingSettingsCard";
import StoreSettingsCard from "@/components/admin/settings/StoreSettingsCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  type AdminSettingsData,
  getSettings,
  updatePassword,
  updatePricingSettings,
  updateProfile,
  updateShippingSettings,
  updateStoreSettings,
} from "@/lib/admin-settings-api";

const emptySettings: AdminSettingsData = {
  profile: { name: "", email: "" },
  store: { storeName: "", storeEmail: "", storePhone: "", storeAddress: "" },
  pricing: { defaultMargin: 0, vat: 0 },
  shipping: { freeShippingThreshold: 0, deliveryDays: 0, shippingCost: 0 },
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AdminSettingsData>(emptySettings);
  const [saving, setSaving] = useState({
    profile: false,
    password: false,
    store: false,
    pricing: false,
    shipping: false,
  });

  const syncAdminUserCache = (name: string, email: string) => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    try {
      const user = JSON.parse(userString) as Record<string, unknown>;
      const nextUser = {
        ...user,
        name,
        fullName: name,
        email,
      };
      localStorage.setItem("user", JSON.stringify(nextUser));
      window.dispatchEvent(new Event("admin-profile-updated"));
    } catch {
      // ignore malformed local user cache
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Kunde inte ladda installningar.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-52 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[280px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[260px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Installningar</h1>
        <p className="text-sm text-muted-foreground">Hantera admin, butik, priser och frakt.</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminProfileCard
          initialName={settings.profile.name}
          initialEmail={settings.profile.email}
          saving={saving.profile}
          onSave={async (input) => {
            try {
              setSaving((prev) => ({ ...prev, profile: true }));
              const data = await updateProfile(input);
              setSettings((prev) => ({ ...prev, profile: data }));
              syncAdminUserCache(data.name || input.name, data.email || input.email);
              toast.success("Profil uppdaterad.");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Kunde inte uppdatera profil.");
            } finally {
              setSaving((prev) => ({ ...prev, profile: false }));
            }
          }}
        />

        <SecurityCard
          saving={saving.password}
          onSave={async (input) => {
            try {
              setSaving((prev) => ({ ...prev, password: true }));
              await updatePassword(input);
              toast.success("Losenord andrat.");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Kunde inte andra losenord.");
            } finally {
              setSaving((prev) => ({ ...prev, password: false }));
            }
          }}
        />

        <StoreSettingsCard
          initialValues={settings.store}
          saving={saving.store}
          onSave={async (input) => {
            try {
              setSaving((prev) => ({ ...prev, store: true }));
              const data = await updateStoreSettings(input);
              setSettings((prev) => ({ ...prev, store: data }));
              toast.success("Butiksinstallningar sparade.");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Kunde inte spara butiksinstallningar.");
            } finally {
              setSaving((prev) => ({ ...prev, store: false }));
            }
          }}
        />

        <PricingSettingsCard
          initialValues={settings.pricing}
          saving={saving.pricing}
          onSave={async (input) => {
            try {
              setSaving((prev) => ({ ...prev, pricing: true }));
              const data = await updatePricingSettings(input);
              setSettings((prev) => ({ ...prev, pricing: data }));
              toast.success("Prisinstallningar sparade.");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Kunde inte spara prisinstallningar.");
            } finally {
              setSaving((prev) => ({ ...prev, pricing: false }));
            }
          }}
        />

        <ShippingSettingsCard
          initialValues={settings.shipping}
          saving={saving.shipping}
          onSave={async (input) => {
            try {
              setSaving((prev) => ({ ...prev, shipping: true }));
              const data = await updateShippingSettings(input);
              setSettings((prev) => ({ ...prev, shipping: data }));
              toast.success("Fraktinstallningar sparade.");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Kunde inte spara fraktinstallningar.");
            } finally {
              setSaving((prev) => ({ ...prev, shipping: false }));
            }
          }}
        />
      </div>

      <Toaster richColors />
    </div>
  );
}
