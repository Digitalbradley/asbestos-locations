import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/SEOHead";
import Home from "@/pages/home";
import StatesPage from "@/pages/states";
import StatePage from "@/pages/state";
import CityPage from "@/pages/city";
import CategoryPage from "@/pages/category";
import GlobalCategoryPage from "@/pages/global-category";
import FacilityPage from "@/pages/facility";
import LegalHelpPage from "@/pages/legal-help";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
import DisclaimerPage from "@/pages/disclaimer";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import ThankYouPage from "@/pages/thank-you";
import AdminLeadsPage from "@/pages/admin/leads";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/states" component={StatesPage} />
          <Route path="/legal-help" component={LegalHelpPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms-of-service" component={TermsOfServicePage} />
          <Route path="/disclaimer" component={DisclaimerPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/thank-you" component={ThankYouPage} />
          <Route path="/admin/leads" component={AdminLeadsPage} />
          <Route path="/category/:categorySlug" component={GlobalCategoryPage} />
          <Route path="/:stateSlug" component={StatePage} />
          <Route path="/:stateSlug/category/:categorySlug" component={CategoryPage} />
          <Route path="/:stateSlug/:citySlug/:facilitySlug-asbestos-exposure" component={FacilityPage} />
          <Route path="/:stateSlug/:citySlug" component={CityPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
