import { api } from "@plantchain-new/backend/convex/_generated/api";
import { Button } from "@plantchain-new/ui/components/button";
import { Input } from "@plantchain-new/ui/components/input";
import { Label } from "@plantchain-new/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Leaf, MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/submit")({
  component: SubmitRoute,
});

const TREE_SPECIES = [
  "Oak",
  "Maple",
  "Pine",
  "Cedar",
  "Birch",
  "Willow",
  "Cherry",
  "Apple",
  "Walnut",
  "Elm",
  "Ash",
  "Beech",
  "Spruce",
  "Fir",
  "Poplar",
  "Other",
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

  const handleSubmit = async (e: FormEvent) => {
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
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Planting Submitted!</h2>
        <p className="text-muted-foreground max-w-sm">
          Your tree planting is being verified by our AI agent. Check back soon to see the result.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto py-8 px-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-500" />
          Log a Tree Planting
        </h1>
        <p className="text-muted-foreground text-sm">
          Submit your planting for AI verification and on-chain recording.
        </p>
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <Label>Photo of your tree *</Label>
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-green-500 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="mx-auto max-h-48 rounded-lg object-cover"
            />
          ) : (
            <div className="py-6 text-muted-foreground text-sm">
              Click to upload a photo of your tree
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

      {/* Species */}
      <div className="space-y-2">
        <Label htmlFor="species">Tree Species *</Label>
        <select
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          required
        >
          <option value="">Select a species...</option>
          {TREE_SPECIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {species === "Other" && (
          <Input
            placeholder="Enter species name"
            value={customSpecies}
            onChange={(e) => setCustomSpecies(e.target.value)}
            required
          />
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location *</Label>
        <Button type="button" variant="outline" onClick={handleLocate} disabled={locating} className="w-full">
          {locating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          {lat && lng ? `${lat}, ${lng}` : "Detect My Location"}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
          <Input
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </div>
        <Input
          placeholder="Location name (optional, e.g. Central Park)"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details about the planting..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Leaf className="h-4 w-4 mr-2" />
            Submit Planting
          </>
        )}
      </Button>
    </form>
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
        <div className="max-w-md mx-auto py-8 px-4 space-y-4">
          <div className="text-center space-y-2">
            <XCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Sign in to submit a planting</h2>
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
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
    </div>
  );
}
