import React, { useState, useRef } from 'react';
import { generateBarakaScriber } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import { Camera, Mic, Activity } from 'lucide-react';

export const BarakaScriber: React.FC = () => {
  const [textInput, setTextInput] = useState('팔꿈치로 타자기를 내리침, 거친 숨소리, 삐걱거리는 의자 소음');
  const [videoActive, setVideoActive] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [resultPoem, setResultPoem] = useState('');
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleCamera = async () => {
    audioSynth.playClick();
    if (videoActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      setVideoActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setVideoActive(true);
      } catch (err) {
        console.warn('Camera access denied:', err);
        alert('카메라 접근 권한을 확인할 수 없습니다. 텍스트 소음 입력 모드로 진행합니다.');
      }
    }
  };

  const toggleMic = () => {
    audioSynth.playClick();
    setAudioActive(!audioActive);
  };

  const handleTranscribe = async () => {
    audioSynth.playLever();
    setLoading(true);
    try {
      const poem = await generateBarakaScriber({
        text: textInput,
      });
      setResultPoem(poem);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Multi-modal Sensors Dashboard */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold uppercase text-stone-700">
            신체 센서 및 노이즈 입력 (Body Signal Inputs)
          </label>

          {/* Text Gesture Input */}
          <div>
            <span className="text-xs font-serif italic text-stone-600 block mb-1">
              신체 소음 / 동작 묘사:
            </span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-2.5 font-serif text-sm border-2 border-stone-400 rounded bg-white"
            />
          </div>

          {/* Camera Scanner Box */}
          <div className="bg-stone-200 border-2 border-stone-400 relative h-48 rounded overflow-hidden flex items-center justify-center group">
            {videoActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90"
              />
            ) : (
              <div className="text-center p-4 text-stone-500 font-mono text-xs">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                카메라 신체 스캐너 비활성
              </div>
            )}
            <div className="absolute top-2 right-2 text-[9px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
              BODY_SCAN_{videoActive ? 'ACTIVE' : 'OFF'}
            </div>
          </div>

          {/* Toggle Sensors Buttons */}
          <div className="flex gap-3">
            <button
              onClick={toggleCamera}
              className={`flex-1 py-2 font-mono text-xs font-bold rounded border uppercase flex items-center justify-center gap-1.5 ${
                videoActive ? 'bg-rose-900 text-white border-rose-950' : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {videoActive ? '카메라 끄기' : '웹캠 스캔 켜기'}
            </button>

            <button
              onClick={toggleMic}
              className={`flex-1 py-2 font-mono text-xs font-bold rounded border uppercase flex items-center justify-center gap-1.5 ${
                audioActive ? 'bg-rose-900 text-white border-rose-950' : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {audioActive ? '마이크 센서 ON' : '마이크 켜기'}
            </button>
          </div>

          {/* Transcribe Button */}
          <button
            onClick={handleTranscribe}
            disabled={loading}
            className="w-full py-4 bg-rose-950 hover:bg-rose-900 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            신체 데이터 전사 (Transcribe Body Noise to Poetry)
          </button>
        </div>

        {/* Poetry Output */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            전사된 파격시 (Transcribed Radical Poem)
          </label>

          <div className="w-full h-80 p-6 font-serif text-base border-2 border-stone-800 bg-[#f4f1e8] rounded text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {loading ? (
              <div className="text-center py-20 text-stone-400 italic animate-pulse font-mono text-xs">
                육체의 파편과 소음을 시로 전사하는 중...
              </div>
            ) : resultPoem ? (
              <div className="whitespace-pre-line font-bold text-rose-950 leading-loose">
                {resultPoem}
              </div>
            ) : (
              <p className="text-stone-400 italic text-sm">
                신체 노이즈 데이터를 입력하고 '신체 데이터 전사' 버튼을 눌러 이성이 절단한 육체의 시를 도출하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
