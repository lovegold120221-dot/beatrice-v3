import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Waves, Loader2, Sparkles, Files, Briefcase, Globe } from 'lucide-react';
import { useLiveAPI } from '../hooks/useLiveAudio';

export default function TalkScreen() {
  const { connect, disconnect, connected, speaking, detectedLanguage } = useLiveAPI();
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');

  useEffect(() => {
    if (!connected) {
      setOrbState('idle');
    } else if (speaking) {
      setOrbState('speaking');
    } else {
      setOrbState('listening');
    }
  }, [connected, speaking]);

  const handleOrbClick = () => {
    if (!connected) {
      connect();
    } else {
      disconnect();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pt-4">
        
        {/* Language Detection overlay when available */}
        <AnimatePresence>
          {detectedLanguage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none"
            >
              <div className="glass-panel-heavy rounded-2xl p-3 border border-[#D4AF37]/30 shadow-lg backdrop-blur-2xl bg-black/60 mx-auto max-w-xs w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="text-[#D4AF37]" size={16} />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/50">Input </span>
                    <span className="text-xs font-semibold text-white">{detectedLanguage.input}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/50">Voice</span>
                  <span className="text-xs font-semibold text-[#D4AF37]">{detectedLanguage.output}</span>
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/50">Conf.</span>
                  <span className="text-xs font-semibold text-white/80">{detectedLanguage.confidence}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Orb Area (Sleek Theme) */}
        <div className="relative flex flex-col items-center justify-center py-8 flex-1">
          <div className="absolute w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[60px]"></div>
          
          <button 
            onClick={handleOrbClick} 
            className={`w-48 h-48 rounded-full border border-white/10 flex items-center justify-center shadow-inner relative focus:outline-none transition-colors duration-500 ${connected ? 'bg-gradient-to-tr from-[#D4AF37]/20 via-black to-[#1a1a1a]' : 'bg-gradient-to-tr from-black via-black to-[#1a1a1a]'}`}
          >
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37]/40 via-black to-transparent p-[1px] flex items-center justify-center ${connected ? 'shadow-[0_0_80px_rgba(212,175,55,0.3)]' : 'shadow-[0_0_30px_rgba(212,175,55,0.1)]'} transition-shadow duration-500`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                 <div className="w-32 h-32 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}>
                   <motion.div 
                     animate={{ 
                       rotate: orbState === 'listening' ? 360 : orbState === 'speaking' ? -360 : 0,
                       scale: orbState === 'speaking' ? [1, 1.15, 1, 1.05, 1] : orbState === 'listening' ? [1, 1.05, 1] : 1
                     }}
                     transition={{ repeat: Infinity, duration: orbState === 'speaking' ? 1.5 : 4, ease: "easeInOut" }}
                     className={`w-12 h-12 rounded-full border-2 ${orbState === 'idle' ? 'border-[#D4AF37]/40' : 'border-[#D4AF37]'} border-t-transparent opacity-60`}
                   />
                 </div>
              </div>
            </div>
            
            {!connected && (
              <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-60">
                 <Mic size={14} className="text-[#D4AF37]" />
                 <span className="text-[8px] uppercase tracking-widest text-[#D4AF37]">Tap to Connect</span>
              </div>
            )}
          </button>

          <div className="mt-8 flex flex-col items-center h-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2 font-medium">
              {orbState === 'idle' && 'Offline'}
              {orbState === 'listening' && 'Listening...'}
              {orbState === 'speaking' && 'Beatrice Speaking'}
            </span>
            {orbState !== 'idle' && (
              <div className="flex gap-1.5">
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 12, 4] : [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 16, 4] : [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 12, 4] : [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Context Panel */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-2">
              <Sparkles size={10} className="text-[#D4AF37]" /> Connected Context
            </span>
            <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:shadow-[0_0_8px_#60a5fa] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">Agenda 11:00</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:shadow-[0_0_8px_#fb923c] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">NDA_Draft.pdf</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-green-400 group-hover:shadow-[0_0_8px_#4ade80] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">Inbox (2)</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:shadow-[0_0_8px_#c084fc] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">WhatsApp</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
