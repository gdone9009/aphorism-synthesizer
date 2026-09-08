import React, { useState, useRef } from 'react';
import { generateBarakaScriber } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Camera, Mic, Activity } from 'lucide-react';

export const BarakaScriberV2: React.FC = () => {
  const [textInput, setTextInput] = useState('팔꿈치로 타자기를 내리침, 비명, 거친 숨소리');
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
        console.warn('Camera error:', err);
        alert('카메라 접근 실패. 텍스트 소음 모드로 전사합니다.');
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
        {/* Physical input controls */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold uppercase text-stone-700">
            신체 노이즈 및 동작 입력 (PHYSICAL_DATA_INPUT)
          </label>

          <div>
            <span className="text-xs font-mono text-stone-500 block mb-1">
              신체 소음 / 동작 묘사:
            </span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-2.5 font-serif text-sm border border-stone-300 rounded-sm bg-white"
            />
          </div>

          {/* Camera Scan Box matching exact reference styling */}
          <div className="bg-stone-200 border-2 border-stone-300 relative min-h-[200px] overflow-hidden rounded-sm flex items-center justify-center group">
            {videoActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:contrast-100 transition-all"
              />
            ) : (
              <div className="text-center p-4 text-stone-500 font-mono text-xs">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-40" />
                카메라 비활성화 (WEBCAM_SCANNER_OFF)
              </div>
            )}
            <div className="absolute top-2 right-2 text-[8px] mono text-white bg-black/70 px-1 py-0.5 rounded">
              BODY_SCAN_{videoActive ? 'ACTIVE' : 'READY'}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleCamera}
              className={`flex-1 py-2 font-mono text-xs font-bold rounded-sm border uppercase flex items-center justify-center gap-1.5 ${
                videoActive ? 'bg-black text-white border-black' : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {videoActive ? '카메라 OFF' : '카메라 ON'}
            </button>

            <button
              onClick={toggleMic}
              className={`flex-1 py-2 font-mono text-xs font-bold rounded-sm border uppercase flex items-center justify-center gap-1.5 ${
                audioActive ? 'bg-black text-white border-black' : 'bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {audioActive ? '마이크 ON' : '마이크 OFF'}
            </button>
          </div>

          {/* Transcribe Button matching exact reference styling */}
          <button
            onClick={handleTranscribe}
            disabled={loading}
            className="w-full py-5 bg-black text-white uppercase tracking-[0.4em] text-xs font-mono font-black hover:bg-red-900 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            {loading ? '육체의 파편을 시로 조립 중...' : '신체 데이터 통합 전사 (INTEGRATE_BODY_POETRY)'}
          </button>
        </div>

        {/* Poetry Output Box */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            전사 결과 (TRANSCRIBED_BODY_POETRY)
          </label>

          <div className="w-full h-80 p-6 font-serif text-base border border-stone-300 bg-stone-50 rounded-sm text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {loading ? (
              <div className="text-center py-20 text-stone-400 italic font-mono text-xs animate-pulse">
                이성 중심 문법을 전복하고 신체 노이즈를 시로 조립하는 중...
              </div>
            ) : resultPoem ? (
              <div className="whitespace-pre-line font-bold text-stone-900 leading-loose">
                {resultPoem}
              </div>
            ) : (
              <p className="text-stone-400 italic text-sm">
                센서 및 소음 데이터를 설정하고 '신체 데이터 통합 전사' 버튼을 눌러 파괴적인 육체의 시를 도출하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
