interface HeroProps {
    children: React.ReactNode;
}

const Hero = ({children}: HeroProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12 animate-fade-in">
                <div className="flex items-center justify-center mb-8">
                    {/* Bigger logo */}
                    <img
                        src="/logo-2.png"
                        alt="App Icon"
                        className="w-28 h-28 object-contain" // increased size further
                    />
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
