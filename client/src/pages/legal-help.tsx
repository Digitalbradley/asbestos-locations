import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertContactSubmissionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Clock, DollarSign, FileText, Phone, Scale, Users } from "lucide-react";
import { z } from "zod";

type ContactFormData = z.infer<typeof insertContactSubmissionSchema>;

export default function LegalHelpPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set document title and meta tags
  useEffect(() => {
    document.title = "Get Free Legal Help | Mesothelioma & Asbestos Exposure Lawyers";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free legal consultation for mesothelioma and asbestos exposure cases. Experienced attorneys ready to help you get the compensation you deserve. No fees unless we win.');
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'mesothelioma lawyer, asbestos attorney, legal help, free consultation, asbestos lawsuit, mesothelioma compensation');
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSubmissionSchema.extend({
      phone: z.string().min(1, "Phone number is required"),
      diagnosis: z.string().optional(),
      pathologyReport: z.string().optional(),
      diagnosisTimeline: z.string().optional(),
    })),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      inquiryType: "legal-referral",
      subject: "Legal Consultation Request",
      message: "",
      diagnosis: "",
      pathologyReport: "",
      diagnosisTimeline: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      // Redirect to thank you page
      setLocation("/thank-you");
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Error submitting form",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form data:", data);
    console.log("Form errors:", form.formState.errors);
    
    // Map exposure details to message field for consistency with schema
    const submissionData = {
      ...data,
      message: data.exposure || "Legal consultation request from legal-help page",
    };
    
    console.log("Submission data:", submissionData);
    contactMutation.mutate(submissionData);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="page-title mb-6">
            Get Free Legal Help
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            If you or a loved one has been diagnosed with mesothelioma or other asbestos-related diseases, 
            you may be entitled to significant compensation. We connect you with experienced attorneys who specialize in asbestos cases.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Why You Need Legal Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Why You Need Legal Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Asbestos exposure cases are complex and require specialized legal expertise. Companies that exposed 
                  workers to asbestos often have extensive legal resources to fight claims. We connect you with experienced 
                  attorneys who understand the medical, technical, and legal aspects of these cases.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Scale className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Experienced Representation</h4>
                      <p className="text-sm text-muted-foreground">Attorneys with decades of asbestos litigation experience</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Maximum Compensation</h4>
                      <p className="text-sm text-muted-foreground">Fighting for full compensation including medical costs, lost wages, and pain and suffering</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Time-Sensitive Claims</h4>
                      <p className="text-sm text-muted-foreground">Statute of limitations applies - acting quickly is crucial</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Can Help With */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">What We Can Help With</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Mesothelioma claims</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Lung cancer cases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Asbestosis claims</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Wrongful death cases</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Trust fund claims</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Veterans' benefits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Class action lawsuits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Family member claims</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Fees Promise */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">No Fees Unless You Win</h3>
                    <p className="text-muted-foreground">
                      We connect you with attorneys who work on a contingency basis - you pay nothing unless they successfully recover compensation for you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Get Free Legal Consultation</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll connect you with a qualified attorney who will contact you within 24 hours to discuss your case.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...form.register("name")}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                    {form.formState.errors.name && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...form.register("phone")}
                      placeholder="(555) 123-4567"
                      type="tel"
                      className="w-full"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...form.register("email")}
                      placeholder="your.email@example.com"
                      type="email"
                      className="w-full"
                    />
                    {form.formState.errors.email && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Case Details */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tell us about your case
                    </label>
                    <Textarea
                      {...form.register("exposure")}
                      placeholder="When did you work? What was your job? Any health issues? Tell us about your situation."
                      rows={4}
                      className="w-full"
                    />
                    {form.formState.errors.exposure && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.exposure.message}
                      </p>
                    )}
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What is the diagnosis?
                    </label>
                    <Select onValueChange={(value) => form.setValue("diagnosis", value)}>
                      <SelectTrigger className="w-full">
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

                  {/* Pathology Report */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Is there a pathology report?
                    </label>
                    <Select onValueChange={(value) => form.setValue("pathologyReport", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diagnosis Timeline */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      When was the diagnosis made?
                    </label>
                    <Select onValueChange={(value) => form.setValue("diagnosisTimeline", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="within_2_years">Within the last 2 years</SelectItem>
                        <SelectItem value="more_than_2_years">More than 2 years ago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold"
                  >
                    {contactMutation.isPending ? "Submitting..." : "Connect with Attorney"}
                  </Button>

                  {/* No Fees Notice */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>No fees unless you win your case</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Case Evaluation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We'll connect you with attorneys who will review your case details, medical records, and work history to determine the best legal strategy for your situation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Expert Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We connect you with legal teams that include attorneys, medical experts, and investigators who specialize in asbestos exposure cases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>24/7 Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We understand this is a difficult time. We're available around the clock to connect you with legal professionals who can answer your questions and provide support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
