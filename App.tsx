
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, ArrowRight, ArrowLeft, Send, Check, X } from 'lucide-react';
import SakuraPetals from './components/SakuraPetals';
import { generateAllLoveSteps } from './services/gemini';

const App: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [finalChoice, setFinalChoice] = useState<'none' | 'yes' | 'no'>('none');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://www.chosic.com/wp-content/uploads/2021/07/The-Garden-Of-Peace.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleReveal = async () => {
    setRevealed(true);
    setLoading(true);
    
    // Iniciar música
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }

    // Cargar TODAS las frases de una vez para que la navegación sea instantánea
    const allPhrases = await generateAllLoveSteps();
    setMessages(allPhrases);
    setLoading(false);
  };

  const nextPage = () => {
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(6); // Ir a la pregunta final
    }
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const titles = [
    "El Inicio del Viaje",
    "La Distancia y el Tiempo",
    "Susurros en el Viento",
    "La Promesa del Mañana",
    "Sueños Compartidos",
    "Nuestro Destino",
    "Una Propuesta de Vida"
  ];

  const finalResponseYes = "¡Mi corazón galopa de felicidad! Lograremos vernos en febrero y será mágico. Imagino una cita romántica bajo el atardecer, una cena tranquila donde el tiempo se detenga y largos paseos tomados de la mano planeando nuestro futuro. Cada momento juntos será un nuevo pétalo en nuestra historia.";
  const finalResponseNo = "Entiendo perfectamente tu decisión y la respeto con toda mi alma. Quiero que sepas que te voy a seguir queriendo con la misma intensidad, y seguiré conociéndote día a día, con paciencia y ternura, hasta ganarme ese rincón especial en tu corazón. Mi amor por ti es libre como el viento.";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Background Forest */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 transition-transform duration-[60s] ease-linear scale-125"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* 3D Falling Leaves */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas gl={{ alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Suspense fallback={null}>
            <Stars radius={50} depth={50} count={600} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={10} color="#ffb7ce" />
            <SakuraPetals />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.02} />
          </Suspense>
        </Canvas>
      </div>

      {/* Experience Overlay */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="text-center space-y-8">
              <h2 className="text-white/40 tracking-[0.8em] font-light uppercase text-[10px] mb-4">Un regalo para tu corazón</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReveal}
                className="group relative bg-transparent p-12 border border-white/10 rounded-full"
              >
                <div className="absolute inset-0 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all" />
                <Heart size={60} className="text-white/30 fill-white/5 group-hover:fill-pink-500 group-hover:text-pink-500 transition-all duration-1000 relative z-10" />
              </motion.button>
              <p className="text-white/20 font-light tracking-[0.4em] text-[10px] animate-pulse">TOCA EL CORAZÓN</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 md:p-12"
          >
            {/* Minimal Progress */}
            <div className="w-full max-w-sm h-[1px] bg-white/10 mt-8 pointer-events-auto rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${((currentPage + 1) / 7) * 100}%` }}
                className="h-full bg-white/60 shadow-[0_0_10px_white]"
              />
            </div>

            {/* Content Card - High Visibility */}
            <div className="max-w-2xl w-full text-center space-y-12 pointer-events-auto bg-black/70 backdrop-blur-3xl p-8 md:p-16 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="py-20 flex flex-col items-center gap-4"
                  >
                    <div className="w-8 h-8 border-2 border-white/10 border-t-pink-400 rounded-full animate-spin" />
                    <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase">Escribiendo nuestra historia...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentPage + (finalChoice !== 'none' ? finalChoice : '')}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <span className="text-pink-300/50 text-[10px] tracking-[0.6em] uppercase block font-bold">
                      {currentPage < 6 ? `Capítulo ${currentPage + 1}` : "La Decisión"}
                    </span>
                    
                    {currentPage < 6 ? (
                      <>
                        <h3 className="text-white/30 font-light text-xs tracking-[0.3em] uppercase">{titles[currentPage]}</h3>
                        <h1 className="font-romantic text-3xl md:text-5xl text-white leading-relaxed drop-shadow-2xl">
                          &ldquo;{messages[currentPage]}&rdquo;
                        </h1>
                      </>
                    ) : finalChoice === 'none' ? (
                      <div className="space-y-12">
                        <h2 className="font-romantic text-4xl md:text-6xl text-white leading-tight">
                          ¿Te gustaría galopar por la vida conmigo y ver hasta dónde llegamos?
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFinalChoice('yes')}
                            className="group flex items-center gap-3 px-12 py-4 bg-white text-black rounded-full font-bold tracking-[0.2em] uppercase transition-all shadow-xl"
                          >
                            <Check size={18} /> SÍ, QUIERO
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFinalChoice('no')}
                            className="flex items-center gap-3 px-12 py-4 bg-transparent border border-white/20 text-white/40 rounded-full font-bold tracking-[0.2em] uppercase transition-all hover:bg-white/5"
                          >
                            <X size={18} /> Por ahora no
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 py-4">
                        <p className="font-romantic text-2xl md:text-4xl text-white/90 leading-relaxed italic">
                          {finalChoice === 'yes' ? finalResponseYes : finalResponseNo}
                        </p>
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="pt-6"
                        >
                          <Heart size={40} className={finalChoice === 'yes' ? "text-pink-400 fill-pink-400 mx-auto" : "text-white/20 mx-auto"} />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Bar */}
              {!loading && currentPage < 6 && (
                <div className="flex justify-between items-center pt-10 border-t border-white/5">
                  <button 
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-3 rounded-full transition-all ${currentPage === 0 ? 'opacity-0' : 'opacity-40 hover:opacity-100 hover:bg-white/5 text-white'}`}
                  >
                    <ArrowLeft size={22} />
                  </button>
                  
                  <div className="flex gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentPage ? 'bg-pink-400 scale-150 shadow-[0_0_10px_#f472b6]' : 'bg-white/10'}`} />
                    ))}
                  </div>

                  <button 
                    onClick={nextPage}
                    className="p-3 rounded-full opacity-40 hover:opacity-100 hover:bg-white/5 text-white transition-all group"
                  >
                    {currentPage === 5 ? (
                      <Send size={22} className="text-pink-300 group-hover:animate-pulse" />
                    ) : (
                      <ArrowRight size={22} />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="text-white/10 text-[8px] tracking-[0.8em] uppercase font-light">
              Nuestra historia en un jardín eterno
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Toggle */}
      <div className="absolute bottom-8 left-8 z-30">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md border border-white/5 transition-all text-white/40 hover:text-white"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-pulse" />}
        </button>
      </div>

      <style>{`
        .font-romantic { font-family: 'Dancing Script', cursive; }
        ::selection { background: rgba(244, 114, 182, 0.2); }
      `}</style>
    </div>
  );
};

export default App;
