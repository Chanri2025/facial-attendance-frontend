import { useState } from "react";
import { Camera, Users, ClipboardCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Register from "@/components/Register";
import Attendance from "@/components/Attendance";
import Dashboard from "@/components/Dashboard";

type View = "home" | "register" | "attendance" | "dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");

  const renderView = () => {
    switch (currentView) {
      case "register":
        return <Register onBack={() => setCurrentView("home")} />;
      case "attendance":
        return <Attendance onBack={() => setCurrentView("home")} />;
      case "dashboard":
        return <Dashboard onBack={() => setCurrentView("home")} />;
      default:
        return (
          <Hero>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Register Face"
                description="Add new employees to the system with facial recognition"
                onClick={() => setCurrentView("register")}
              />
              <FeatureCard
                icon={<Camera className="w-8 h-8" />}
                title="Mark Attendance"
                description="Quick check-in using facial recognition technology"
                onClick={() => setCurrentView("attendance")}
              />
              <FeatureCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="View Records"
                description="Access attendance history and analytics dashboard"
                onClick={() => setCurrentView("dashboard")}
              />
            </div>
          </Hero>
        );
    }
  };

  return <div className="min-h-screen bg-gradient-subtle">{renderView()}</div>;
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard = ({ icon, title, description, onClick }: FeatureCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-medium border border-border"
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity" />
      <div className="relative z-10">
        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Index;
