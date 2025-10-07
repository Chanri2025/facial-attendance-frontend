import { ClipboardCheck } from "lucide-react";

interface HeroProps {
  children: React.ReactNode;
}

const Hero = ({ children }: HeroProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-medium">
            <ClipboardCheck className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Facial Attendance
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Modern attendance management powered by facial recognition technology
        </p>
      </div>
      {children}
    </div>
  );
};

export default Hero;
