"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// --- Schema ---
const applySchema = z.object({
  photoProfile: z.instanceof(File).optional(),
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  domicile: z.string().nonempty("Please select domicile"),
  countryCode: z.string().nonempty(),
  phoneNumber: z.string().min(6, "Enter a valid number"),
  email: z.string().email(),
  linkedinLink: z.string().url().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

// --- Dummy location data ---
const dummyLocations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Medan",
  "Yogyakarta",
];

// --- Dummy country codes ---
const countryCodes = [
  { code: "+62", label: "Indonesia" },
  { code: "+60", label: "Malaysia" },
  { code: "+65", label: "Singapore" },
  { code: "+63", label: "Philippines" },
  { code: "+1", label: "United States" },
];

export default function ApplyForm({
  token,
  onSuccess,
}: {
  token?: string;
  onSuccess?: () => void;
}) {
  const [photo, setPhoto] = useState<File | null>(null);

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      domicile: "",
      countryCode: "+62",
      phoneNumber: "",
      email: "",
      linkedinLink: "",
    },
  });

  const handleTakePicture = () => {
    toast({
      title: "Take Picture",
      description: "Simulating camera access...",
    });
  };

  const onSubmit = (values: ApplyFormValues) => {
    console.log(values);
    toast({
      title: "Application Submitted",
      description: "Your job application has been submitted successfully.",
    });
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
        {/* Photo */}
        <FormItem>
          <FormLabel>Photo Profile</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
              <Button type="button" onClick={handleTakePicture}>
                Take a Picture
              </Button>
            </div>
          </FormControl>
          {photo && <p className="text-sm text-gray-600 mt-1">{photo.name}</p>}
        </FormItem>
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Domicile */}
        <FormField
          control={form.control}
          name="domicile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domicile</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your domicile" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Phone Number */}
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Country code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.label} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="8123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* LinkedIn */}
        <FormField
          control={form.control}
          name="linkedinLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit */}
        <div className="pt-4 border-t">
          <Button type="submit" className="ml-auto block">
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
