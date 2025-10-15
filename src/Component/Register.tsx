import {useState, useRef, useEffect} from "react";
import {ArrowLeft, Camera, UserPlus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card} from "@/components/ui/card.tsx";
import {toast} from "sonner";

interface RegisterProps {
    onBack: () => void;
}

const Register = ({onBack}: RegisterProps) => {
    const [name, setName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {width: 640, height: 480},
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

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);

                // Here you would process the image with face detection
                toast.success("Face captured successfully!");
            }
        }
    };

    const handleRegister = () => {
        if (!name || !employeeId) {
            toast.error("Please fill in all fields");
            return;
        }

        // Here you would save the face data
        toast.success(`${name} registered successfully!`);
        stopCamera();
        onBack();
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
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    Back
                </Button>

                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-card-foreground">Register New Employee</h2>
                            <p className="text-muted-foreground">Add facial data for attendance tracking</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-card-foreground mb-2 block">
                                    Full Name
                                </label>
                                <Input
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-card-foreground mb-2 block">
                                    Employee ID
                                </label>
                                <Input
                                    placeholder="EMP001"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-card-foreground mb-2 block">
                                Capture Face
                            </label>
                            <div className="relative bg-muted rounded-xl overflow-hidden" style={{aspectRatio: "4/3"}}>
                                {isCameraActive ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                                            <p className="text-muted-foreground">Camera preview will appear here</p>
                                        </div>
                                    </div>
                                )}
                                <canvas ref={canvasRef} className="hidden"/>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {!isCameraActive ? (
                                <Button onClick={startCamera} className="flex-1">
                                    <Camera className="w-4 h-4 mr-2"/>
                                    Start Camera
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={capturePhoto} className="flex-1">
                                        Capture Face
                                    </Button>
                                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                                        Stop Camera
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button onClick={handleRegister} className="w-full" size="lg">
                            <UserPlus className="w-4 h-4 mr-2"/>
                            Register Employee
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
