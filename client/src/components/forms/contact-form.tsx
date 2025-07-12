import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
  facilityId: z.number().optional(),
  inquiryType: z.string().optional(),
  subject: z.string().optional(),
  exposure: z.string().optional(),
  diagnosis: z.string().optional(),
  pathologyReport: z.string().optional(),
  diagnosisTimeline: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  facilityId?: number;
  facilityName?: string;
  className?: string;
}

export default function ContactForm({ 
  facilityId, 
  facilityName,
  className = "" 
}: ContactFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      facilityId: facilityId,
      inquiryType: "facility-inquiry",
      subject: facilityName ? `Inquiry about ${facilityName}` : "Asbestos Exposure Inquiry",
      exposure: "",
      diagnosis: "",
      pathologyReport: "",
      diagnosisTimeline: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      // Redirect to thank you page
      setLocation("/thank-you");
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting form",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactMutation.mutate(data);
  };

  return (
    <div className={`bg-card rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Get Free Legal Consultation</h3>
      <p className="text-muted-foreground text-sm mb-6">
        If you or a loved one worked at {facilityName ? `${facilityName} ` : "this facility "}
        and developed mesothelioma, you may be entitled to compensation.
      </p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name *
          </Label>
          <Input
            id="name"
            {...form.register("name")}
            className="mt-1 focus-ring"
            placeholder="Enter your full name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            {...form.register("phone")}
            className="mt-1 focus-ring"
            placeholder="(555) 123-4567"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            className="mt-1 focus-ring"
            placeholder="your.email@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="message" className="text-sm font-medium text-foreground">
            Tell us about your exposure
          </Label>
          <Textarea
            id="message"
            {...form.register("message")}
            rows={4}
            className="mt-1 focus-ring"
            placeholder="When did you work here? What was your job? Any health issues?"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium text-foreground">
            What is the diagnosis?
          </Label>
          <Select onValueChange={(value) => form.setValue("diagnosis", value)}>
            <SelectTrigger className="mt-1 focus-ring">
              <SelectValue placeholder="Select diagnosis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mesothelioma">Mesothelioma</SelectItem>
              <SelectItem value="lung-cancer">Lung Cancer</SelectItem>
              <SelectItem value="asbestosis">Asbestosis</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-foreground">
            Is there a pathology report?
          </Label>
          <Select onValueChange={(value) => form.setValue("pathologyReport", value)}>
            <SelectTrigger className="mt-1 focus-ring">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-foreground">
            When was the diagnosis made?
          </Label>
          <Select onValueChange={(value) => form.setValue("diagnosisTimeline", value)}>
            <SelectTrigger className="mt-1 focus-ring">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="within_2_years">Within the last 2 years</SelectItem>
              <SelectItem value="more_than_2_years">More than 2 years ago</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          type="submit"
          disabled={submitContactMutation.isPending}
          className="w-full primary-button"
        >
          {submitContactMutation.isPending ? "Submitting..." : "Connect with Attorney"}
        </Button>
      </form>
      
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>✓ No fees unless we win your case</p>
        <p>✓ Free consultation within 24 hours</p>
        <p>✓ Your information is kept confidential</p>
      </div>
    </div>
  );
}
