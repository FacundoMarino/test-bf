"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";

import {
  deleteClubAction,
  saveClubProfileAction,
} from "@/actions/club-profile";
import type { ClubRecord, ProfileRecord } from "@/types/club";
import {
  AMENITY_LABELS,
  clubProfileSaveSchema,
  DEFAULT_AMENITY_KEYS,
} from "@/types/club";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { buildInitialFormState } from "./club-form-utils";

export function ClubProfileForm({
  initialClub,
  initialProfile,
  hasCourts,
}: {
  initialClub: ClubRecord | null;
  initialProfile: ProfileRecord | null;
  hasCourts: boolean;
}) {
  const router = useRouter();
  const initial = buildInitialFormState(initialClub, initialProfile);
  const [clubName, setClubName] = useState(initial.clubName);
  const [description, setDescription] = useState(initial.description);
  const [email, setEmail] = useState(initial.email);
  const [web, setWeb] = useState(initial.web);
  const [phone, setPhone] = useState(initial.phone);
  const [location, setLocation] = useState(initial.location);
  const [address, setAddress] = useState(initial.address);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [courtCount, setCourtCount] = useState(initial.courtCount);
  const [courtType, setCourtType] = useState(initial.courtType);
  const [amenities, setAmenities] = useState(initial.amenities);
  const [weekdayPrice, setWeekdayPrice] = useState(() => {
    const weekdayKeys = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];
    const first = initial.pricing.find((p) => weekdayKeys.includes(p.day));
    return first?.pricePerHour ?? 0;
  });
  const [weekendPrice, setWeekendPrice] = useState(() => {
    const first = initial.pricing.find(
      (p) => p.day === "saturday" || p.day === "sunday",
    );
    return first?.pricePerHour ?? 0;
  });
  const [pending, setPending] = useState(false);
  const [redirectToCourtsState, setRedirectToCourtsState] = useState<
    "idle" | "saving" | "success"
  >("idle");
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function submitProfile(opts?: { redirectToCourts?: boolean }) {
    const redirectToCourts = opts?.redirectToCourts === true;
    setMessage(null);
    if (redirectToCourts) {
      setRedirectToCourtsState("saving");
    }
    const payload = {
      clubId: initialClub?.id,
      club: {
        name: clubName,
        address,
        email,
        web,
        avatarUrl,
        courtCount,
        courtType,
        pricing: [
          { day: "monday", pricePerHour: weekdayPrice },
          { day: "tuesday", pricePerHour: weekdayPrice },
          { day: "wednesday", pricePerHour: weekdayPrice },
          { day: "thursday", pricePerHour: weekdayPrice },
          { day: "friday", pricePerHour: weekdayPrice },
          { day: "saturday", pricePerHour: weekendPrice },
          { day: "sunday", pricePerHour: weekendPrice },
        ],
      },
      profile: {
        description,
        location,
        phone,
        amenities,
      },
    };
    const check = clubProfileSaveSchema.safeParse(payload);
    if (!check.success) {
      if (redirectToCourts) {
        setRedirectToCourtsState("idle");
      }
      setMessage({
        type: "err",
        text: check.error.issues[0]?.message ?? "Revisá los datos",
      });
      return;
    }
    setPending(true);
    const res = await saveClubProfileAction(check.data);
    setPending(false);
    if (res.ok) {
      setMessage({ type: "ok", text: "Cambios guardados correctamente." });
      if (redirectToCourts) {
        setRedirectToCourtsState("success");
        setTimeout(() => {
          router.push("/dashboard/club/canchas");
        }, 1000);
      }
      router.refresh();
    } else {
      if (redirectToCourts) {
        setRedirectToCourtsState("idle");
      }
      setMessage({ type: "err", text: res.error });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitProfile();
  }

  async function handleDelete() {
    if (!initialClub?.id) return;
    if (
      !window.confirm("¿Eliminar este club? Esta acción no se puede deshacer.")
    )
      return;
    setPending(true);
    const res = await deleteClubAction(initialClub.id);
    setPending(false);
    if (res.ok) {
      try {
        localStorage.removeItem("serxus_club_setup_nudge");
      } catch {
        /* ignore */
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      setMessage({ type: "err", text: res.error });
    }
  }

  const showAvatar =
    avatarUrl &&
    (() => {
      try {
        return Boolean(new URL(avatarUrl));
      } catch {
        return false;
      }
    })();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message?.type === "ok" ? (
        <Alert>
          <AlertTitle>Guardado</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}
      {message?.type === "err" ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Información general
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clubName">Nombre del club</Label>
                <Input
                  id="clubName"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Club Padel Valencia"
                  className="h-11 rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumen del club, instalaciones y ambiente."
                  rows={4}
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-lg pl-10"
                      placeholder="+34 …"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-lg pl-10"
                      placeholder="contacto@club.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="web">Web</Label>
                  <div className="relative">
                    <Globe className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="web"
                      value={web}
                      onChange={(e) => setWeb(e.target.value)}
                      className="h-11 rounded-lg pl-10"
                      placeholder="https://…"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ciudad</Label>
                  <div className="relative">
                    <MapPin className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11 rounded-lg pl-10"
                      placeholder="Valencia"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <MapPin className="text-muted-foreground pointer-events-none absolute left-3 top-3 size-4" />
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-11 rounded-lg pl-10"
                    placeholder="Calle, número, CP"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="courtCount">Canchas</Label>
                  <Input
                    id="courtCount"
                    type="number"
                    min={1}
                    value={courtCount}
                    onChange={(e) =>
                      setCourtCount(Number.parseInt(e.target.value, 10) || 1)
                    }
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtType">Tipo de canchas</Label>
                  <select
                    id="courtType"
                    value={courtType}
                    onChange={(e) =>
                      setCourtType(
                        e.target.value as "indoor" | "outdoor" | "both",
                      )
                    }
                    className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm shadow-sm"
                  >
                    <option value="indoor">Interior</option>
                    <option value="outdoor">Exterior</option>
                    <option value="both">Ambas</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Precios
            </h2>
            {!hasCourts ? (
              <div className="border-border bg-muted/20 text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                Primero debés crear una cancha para configurar precios.
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg"
                    disabled={pending || redirectToCourtsState !== "idle"}
                    onClick={() =>
                      void submitProfile({ redirectToCourts: true })
                    }
                  >
                    Guardar y crear cancha
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekdayPrice">
                    Precio semana (Lun-Vie) por hora
                  </Label>
                  <Input
                    id="weekdayPrice"
                    type="number"
                    min={0}
                    step="0.5"
                    value={weekdayPrice}
                    onChange={(e) =>
                      setWeekdayPrice(
                        Math.max(0, Number.parseFloat(e.target.value) || 0),
                      )
                    }
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekendPrice">
                    Precio fin de semana (Sáb-Dom) por hora
                  </Label>
                  <Input
                    id="weekendPrice"
                    type="number"
                    min={0}
                    step="0.5"
                    value={weekendPrice}
                    onChange={(e) =>
                      setWeekendPrice(
                        Math.max(0, Number.parseFloat(e.target.value) || 0),
                      )
                    }
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Fotos
            </h2>
            <p className="text-muted-foreground mb-3 text-xs">
              URL de la imagen principal del club (avatar). La galería múltiple
              llegará en una próxima versión.
            </p>
            <div className="border-border bg-muted/30 relative aspect-video w-full overflow-hidden rounded-xl border">
              {showAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- URL arbitraria del club
                <img
                  src={avatarUrl}
                  alt="Vista previa del club"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  Sin imagen
                </div>
              )}
              <div className="bg-background/90 absolute bottom-2 right-2 rounded-full p-2 shadow">
                <Camera className="text-muted-foreground size-4" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor="avatarUrl">URL de imagen</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="h-11 rounded-lg"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full rounded-lg"
              disabled
            >
              <Camera className="mr-2 size-4" />
              Subir más fotos (próximamente)
            </Button>
          </section>

          <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Servicios
            </h2>
            <ul className="space-y-3">
              {DEFAULT_AMENITY_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span>{AMENITY_LABELS[key]}</span>
                  <Switch
                    checked={amenities[key] ?? false}
                    onCheckedChange={(checked) =>
                      setAmenities((a) => ({ ...a, [key]: checked }))
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl px-8 font-semibold"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
        {initialClub?.id ? (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            className="h-11 rounded-xl"
            onClick={() => void handleDelete()}
          >
            <Trash2 className="mr-2 size-4" />
            Eliminar club
          </Button>
        ) : null}
      </div>

      <Dialog open={redirectToCourtsState !== "idle"} disablePointerDismissal>
        <DialogContent className="max-w-md rounded-xl" showCloseButton={false}>
          <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
            {redirectToCourtsState === "saving" ? (
              <>
                <Loader2 className="text-primary size-10 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Guardando la información del club...
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-12 text-emerald-600" />
                <p className="text-sm font-medium">
                  Se guardó correctamente la información del club y será
                  redirigido a canchas.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
