import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AttendanceProps {
  onBack: () => void;
}

const Attendance = ({ onBack }: AttendanceProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error("Failed to access camera");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const markAttendance = async () => {
    setIsProcessing(true);
    
    // Simulate face recognition processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Attendance marked successfully!", {
        description: "Welcome back, John Doe!"
      });
      stopCamera();
      setTimeout(onBack, 1500);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">Mark Attendance</h2>
              <p className="text-muted-foreground">Scan your face to check in</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="relative bg-muted rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-white font-medium">Recognizing face...</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Position your face in the camera</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-card-foreground mb-2">Instructions:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure good lighting conditions</li>
                <li>• Face the camera directly</li>
                <li>• Remove any face coverings</li>
                <li>• Stay still during recognition</li>
              </ul>
            </div>

            <div className="flex gap-3">
              {!isCameraActive ? (
                <Button onClick={startCamera} className="flex-1" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={markAttendance} 
                    className="flex-1" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button 
                    onClick={stopCamera} 
                    variant="outline" 
                    className="flex-1" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
