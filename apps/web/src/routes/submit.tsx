import { api } from "@plantchain-new/backend/convex/_generated/api";
import { Button } from "@plantchain-new/ui/components/button";
import { Input } from "@plantchain-new/ui/components/input";
import { Label } from "@plantchain-new/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Camera, CheckCircle2, Leaf, Loader2, MapPin, XCircle } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/submit")({
  component: SubmitRoute,
});

const TREE_SPECIES = [
  "Oak", "Maple", "Pine", "Cedar", "Birch", "Willow", "Cherry",
  "Apple", "Walnut", "Elm", "Ash", "Beech", "Spruce", "Fir", "Poplar", "Other",
];

function SubmitForm() {
  const [species, setSpecies] = useState("");
  const [customSpecies, setCustomSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationName, setLocationName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.plantings.generateUploadUrl);
  const submit = useMutation(api.plantings.submit);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
        toast.success("Location detected");
      },
      () => {
        toast.error("Could not get location. Enter manually.");
        setLocating(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpecies = species === "Other" ? customSpecies.trim() : species;
    if (!finalSpecies || !lat || !lng || !photoFile) {
      toast.error("Please fill in all required fields and add a photo");
      return;
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      toast.error("Invalid coordinates");
      return;
    }

    setSubmitting(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": photoFile.type },
        body: photoFile,
      });
      if (!uploadRes.ok) throw new Error("Photo upload failed");
      const { storageId } = (await uploadRes.json()) as { storageId: string };

      await submit({
        species: finalSpecies,
        latitude,
        longitude,
        locationName: locationName.trim() || undefined,
        photoStorageId: storageId as Parameters<typeof submit>[0]["photoStorageId"],
        notes: notes.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-semibold">Planting Submitted!</h2>
        <p className="text-muted-foreground max-w-sm">
          Your tree planting is being verified by our AI agent. Check back soon to see the result.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2">
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold flex items-center gap-2.5 mb-2">
          <Leaf className="h-6 w-6 text-leaf" />
          Log a Tree Planting
        </h1>
        <p className="text-sm text-muted-foreground ml-8">
          Submit your planting for AI verification and on-chain recording.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="rounded-xl border bg-card overflow-hidden">
          {/* Photo Section */}
          <div className="p-6 border-b border-border">
            <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Photo Evidence
            </div>
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-leaf transition-colors bg-muted/30"
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mx-auto max-h-52 rounded-lg object-cover"
                />
              ) : (
                <div className="py-6">
                  <div className="w-12 h-12 rounded-full bg-mist dark:bg-secondary mx-auto mb-3 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Click to upload</span> a photo of your tree
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG or PNG · GPS metadata helps verification</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhoto}
            />
          </div>

          {/* Species Section */}
          <div className="p-6 border-b border-border">
            <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Tree Information
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="species" className="text-sm font-medium">Species *</Label>
                <select
                  id="species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-leaf focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select a species...</option>
                  {TREE_SPECIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {species === "Other" && (
                <Input
                  placeholder="Enter species name"
                  value={customSpecies}
                  onChange={(e) => setCustomSpecies(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="p-6 border-b border-border">
            <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Location
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleLocate}
                disabled={locating}
                className="w-full justify-center"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {lat && lng ? `${lat}, ${lng}` : "Detect My Location"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Latitude *</Label>
                  <Input
                    placeholder="e.g. 19.0760"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Longitude *</Label>
                  <Input
                    placeholder="e.g. 72.8777"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Location name (optional)</Label>
                <Input
                  placeholder="e.g. Central Park, NYC"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-6 border-b border-border">
            <div className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Notes
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the planting context — conditions, purpose, companion species..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm min-h-[80px] resize-none focus:border-leaf focus:outline-none transition-colors"
            />
          </div>

          {/* Footer */}
          <div className="p-6 bg-muted/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              AI agent will verify this submission
            </span>
            <Button type="submit" disabled={submitting} className="bg-forest hover:bg-forest-mid text-white">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit for Verification
                  <Leaf className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SubmitRoute() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="overflow-y-auto">
      <Authenticated>
        <SubmitForm />
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto py-10 px-4 space-y-6">
          <div className="text-center space-y-2">
            <XCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <h2 className="font-serif text-xl font-semibold">Sign in to submit a planting</h2>
            <p className="text-sm text-muted-foreground">Create an account or sign in to log your tree plantings.</p>
          </div>
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-leaf" />
        </div>
      </AuthLoading>
    </div>
  );
}
