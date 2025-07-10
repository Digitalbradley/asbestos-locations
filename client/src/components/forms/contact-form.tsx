import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
  facilityId: z.number().optional(),
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
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      facilityId: facilityId,
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Form submitted successfully!",
        description: "We'll contact you within 24 hours for your free consultation.",
      });
      form.reset();
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
