
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import WisteriaFlower from './components/WisteriaFlower';
import SakuraPetals from './components/SakuraPetals';
import HorseSpirit from './components/HorseSpirit';
import { generateLoveStep } from './services/gemini';

const App: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [messages, setMessages] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://www.chosic.com/wp-content/uploads/2021/07/The-Garden-Of-Peace.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => audio.pause();
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const loadStep = async (step: number) => {
    if (messages[step]) return;
    setLoading(true);
    const text = await generateLoveStep(step);
    const newMessages = [...messages];
    newMessages[step] = text;
    setMessages(newMessages);
    setLoading(false);
  };

  const handleReveal = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }
    setRevealed(true);
    await loadStep(0);
  };

  const nextPage = async () => {
    if (currentPage < 5) {
      const next = currentPage + 1;
      setCurrentPage(next);
      await loadStep(next);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const titles = [
    "La Prueba de la Distancia",
    "El Puente de la Confianza",
    "El Susurro de las Palabras",
    "El Cultivo de la Paciencia",
    "La Visión del Futuro",
    "El Sello de la Eternidad"
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Background Image - Sakura Forest */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear scale-110"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2000&auto=format&fit=crop')",
          filter: "brightness(0.4) contrast(1.2)"
        }}
      />

      {/* 3D Overlay Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas gl={{ alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={1500} factor={4} saturation={1} fade speed={1} />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={25} color="#ffb7ce" />
            <pointLight position={[-10, -10, -10]} intensity={15} color="#7b68ee" />
            
            {/* Sakura Fall Effect */}
            <SakuraPetals />
            
            {/* Wisteria Clusters */}
            <WisteriaFlower position={[-8, 7, 0]} color="#b19cd9" />
            <WisteriaFlower position={[8, 7, 2]} color="#9370db" />
            <WisteriaFlower position={[0, 8, -5]} color="#ba55d3" />
            
            {/* Ethereal Horses - Brought slightly forward */}
            <HorseSpirit position={[-10, -3, -5]} rotationY={Math.PI / 4} />
            <HorseSpirit position={[10, 1, -8]} rotationY={-Math.PI / 3} />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.15} 
            />
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
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20 }} 
              animate={{ y: 0 }}
              className="text-center space-y-10"
            >
              <h2 className="text-pink-100 tracking-[0.6em] font-light uppercase text-xs mb-4 drop-shadow-glow">El destino nos aguarda en el jardín</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReveal}
                className="group relative bg-transparent p-12 rounded-full border border-white/20"
              >
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/40 transition-all" />
                <Heart size={70} className="text-white fill-white/10 group-hover:fill-pink-400 group-hover:text-pink-400 transition-all duration-700 relative z-10" />
                <Sparkles size={32} className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" />
              </motion.button>
              <p className="text-white/60 font-light italic tracking-widest text-xs">PARA TI, CON TODO MI AMOR</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-between p-8 md:p-12 pointer-events-none"
          >
            {/* Progress Bar */}
            <div className="w-full max-w-md h-[1px] bg-white/20 rounded-full overflow-hidden pointer-events-auto mt-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / 6) * 100}%` }}
                className="h-full bg-gradient-to-r from-pink-300 via-white to-purple-300 shadow-[0_0_10px_white]"
              />
            </div>

            {/* Letter Content */}
            <div className="max-w-2xl w-full text-center space-y-10 pointer-events-auto bg-black/50 backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] border border-white/10 shadow-2xl">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <span className="text-pink-300 text-[10px] tracking-[0.5em] font-bold uppercase block mb-2">Capítulo {currentPage + 1}</span>
                <h3 className="text-white/60 font-light text-lg tracking-[0.2em]">{titles[currentPage]}</h3>
                {loading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-6 h-6 border border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <h1 className="font-romantic text-3xl md:text-5xl text-white leading-tight italic drop-shadow-lg">
                    &ldquo;{messages[currentPage]}&rdquo;
                  </h1>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-10">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-4 rounded-full border border-white/10 transition-all ${currentPage === 0 ? 'opacity-0 disabled' : 'hover:bg-white/10 opacity-40 hover:opacity-100'}`}
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="flex gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full transition-all duration-500 ${i === currentPage ? 'bg-white scale-150 shadow-[0_0_8px_white]' : 'bg-white/20'}`} />
                  ))}
                </div>

                <button 
                  onClick={nextPage}
                  className={`p-4 rounded-full border border-white/20 bg-white/5 transition-all hover:bg-white/20 ${currentPage === 5 ? 'hidden' : 'block'}`}
                >
                  <ArrowRight size={20} className="text-white" />
                </button>
                
                {currentPage === 5 && (
                  <motion.button 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-pink-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    NUESTRA UNIÓN <Send size={14} />
                  </motion.button>
                )}
              </div>
            </div>

            <div className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-light drop-shadow-md">
              Corazones que galopan entre flores
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Controls */}
      <div className="absolute bottom-10 right-10 z-30">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-xl border border-white/10 transition-all shadow-lg"
        >
          {isMuted ? <VolumeX size={16} className="text-white/30" /> : <Volume2 size={16} className="text-white animate-pulse" />}
        </button>
      </div>

      <style>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
      `}</style>
    </div>
  );
};

export default App;
