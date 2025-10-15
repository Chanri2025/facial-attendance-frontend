import {useState, useRef, useEffect} from "react";
import {ArrowLeft, Camera, CheckCircle, Upload} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {toast} from "sonner";
import {API_URL} from "@/config.js";

interface AttendanceProps {
    onBack: () => void;
}

const Attendance = ({onBack}: AttendanceProps) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Upload state
    const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {width: 640, height: 480},
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
                // clear any previous upload
                if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
                setUploadedPreview(null);
                setUploadedFile(null);
            }
        } catch (error) {
            toast.error("Failed to access camera");
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // basic guard: image only
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
        const url = URL.createObjectURL(file);
        setUploadedPreview(url);
        setUploadedFile(file);
        stopCamera(); // ensure only one source is active
    };

    // Capture a single frame from the <video> to a Blob
    const captureFrameBlob = (): Promise<Blob> =>
        new Promise((resolve, reject) => {
            const video = videoRef.current;
            if (!video) return reject(new Error("Video element not found"));
            const canvas = document.createElement("canvas");
            // Use the element size for what the user sees
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context not available"));
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error("Failed to capture frame"));
                resolve(blob);
            }, "image/jpeg", 0.92);
        });

    const markAttendance = async () => {
        try {
            setIsProcessing(true);

            let fileToSend: File;

            if (uploadedFile) {
                // Use uploaded file directly
                fileToSend = uploadedFile;
            } else if (isCameraActive) {
                // Capture a snapshot from the camera
                const blob = await captureFrameBlob();
                fileToSend = new File([blob], "camera.jpg", {type: "image/jpeg"});
            } else {
                toast.message("Choose a method", {
                    description: "Start the camera or upload a photo first.",
                });
                setIsProcessing(false);
                return;
            }

            const form = new FormData();
            form.append("image", fileToSend);

            const res = await fetch(`${API_URL}/image/recognize`, {
                method: "POST",
                body: form,
                // NOTE: Do NOT set Content-Type; browser sets proper multipart boundary
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Request failed with ${res.status}`);
            }

            const data: { person?: string; confidence?: number } = await res.json();

            const name = data.person ?? "Unknown";
            const conf =
                typeof data.confidence === "number"
                    ? ` (confidence ${(data.confidence * 100).toFixed(1)}%)`
                    : "";

            // You can add your own threshold rule if you want
            toast.success("Attendance marked!", {
                description: `${name}${conf}`,
            });

            // cleanup & go back
            stopCamera();
            if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
            setUploadedPreview(null);
            setUploadedFile(null);

            setTimeout(onBack, 1200);
        } catch (err: any) {
            console.error(err);
            toast.error("Recognition failed", {
                description: err?.message || "Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
            if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={onBack} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    Back
                </Button>

                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-card-foreground">Mark Attendance</h2>
                            <p className="text-muted-foreground">
                                Scan or upload your face to check in
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div
                                className="relative bg-muted rounded-xl overflow-hidden"
                                style={{aspectRatio: "4/3"}}
                            >
                                {isCameraActive ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : uploadedPreview ? (
                                    <img
                                        src={uploadedPreview}
                                        alt="Uploaded preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                                            <p className="text-muted-foreground">
                                                Position your face in the camera or upload a photo
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                                            <p className="text-white font-medium">Recognizing face...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <h3 className="font-medium text-card-foreground mb-2">
                                Instructions:
                            </h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Ensure good lighting conditions</li>
                                <li>• Face the camera directly</li>
                                <li>• Remove any face coverings</li>
                                <li>• Stay still during recognition</li>
                            </ul>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!isCameraActive && !uploadedPreview ? (
                                <>
                                    <Button onClick={startCamera} className="flex-1" size="lg">
                                        <Camera className="w-4 h-4 mr-2"/>
                                        Start Camera
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleUploadClick}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        <Upload className="w-4 h-4 mr-2"/>
                                        Upload Photo
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={markAttendance}
                                        className="flex-1"
                                        size="lg"
                                        disabled={isProcessing}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2"/>
                                        Mark Attendance
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            stopCamera();
                                            if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
                                            setUploadedPreview(null);
                                            setUploadedFile(null);
                                        }}
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
