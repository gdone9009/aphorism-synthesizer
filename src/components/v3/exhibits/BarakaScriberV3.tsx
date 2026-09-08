import React, { useState, useRef } from 'react';
import { generateBarakaScriber } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { Camera, Mic, Activity } from 'lucide-react';

export const BarakaScriberV3: React.FC = () => {
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
        {/* Physical Sensor Control */}
        <div className="space-y-4">
          <label className="block text-xs font-mono font-bold uppercase text-stone-700">
            신체 노이즈 및 파동 입력 (BODY_WAVEFORM_INPUT)
          </label>

          <div>
            <span className="text-xs font-serif text-stone-600 block mb-1">
              신체 소음 / 동작 묘사:
            </span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-2.5 font-serif text-sm border-2 border-stone-800 rounded bg-white"
            />
          </div>

          {/* Camera Scanner with Waveform Overlay */}
          <div className="bg-stone-900 border-2 border-stone-800 relative h-48 rounded overflow-hidden flex items-center justify-center group shadow-inner">
            {videoActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90"
              />
            ) : (
              <div className="text-center p-4 text-stone-400 font-mono text-xs">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50 text-rose-500" />
                카메라 비디오 스캐너 비활성
              </div>
            )}

            {/* Spectrogram Waveform Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between px-2 pb-1 pointer-events-none">
              {[40, 70, 30, 90, 50, 80, 20, 100, 60, 45, 85].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-t ${audioActive ? 'bg-rose-500 animate-pulse' : 'bg-stone-600'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="absolute top-2 right-2 text-[9px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-stone-700">
              BODY_SPECTROGRAM: {videoActive ? 'LIVE' : 'IDLE'}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleCamera}
              className={`flex-1 py-2.5 font-mono text-xs font-bold rounded border uppercase flex items-center justify-center gap-1.5 ${
                videoActive ? 'bg-rose-900 text-white border-rose-950' : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {videoActive ? '카메라 OFF' : '카메라 ON'}
            </button>

            <button
              onClick={toggleMic}
              className={`flex-1 py-2.5 font-mono text-xs font-bold rounded border uppercase flex items-center justify-center gap-1.5 ${
                audioActive ? 'bg-rose-900 text-white border-rose-950' : 'bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {audioActive ? '마이크 센서 ON' : '마이크 OFF'}
            </button>
          </div>

          <button
            onClick={handleTranscribe}
            disabled={loading}
            className="w-full py-4 bg-rose-950 hover:bg-black text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-30"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            {loading ? '육체의 파편을 시로 전사하는 중...' : '신체 데이터 전사 (Transcribe Body Noise to Poetry)'}
          </button>
        </div>

        {/* Output */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            전사 결과 (Transcribed Body Poetry)
          </label>
          <div className="w-full h-80 p-6 font-serif text-base border-2 border-stone-900 bg-[#f5f2e9] rounded text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {loading ? (
              <div className="text-center py-20 text-stone-400 italic font-mono text-xs animate-pulse">
                이성적 문법을 절단하고 육체의 소음을 시로 조립하는 중...
              </div>
            ) : resultPoem ? (
              <div className="whitespace-pre-line font-bold text-rose-950 leading-loose">
                {resultPoem}
              </div>
            ) : (
              <p className="text-stone-400 italic text-sm">
                센서 노이즈를 입력하고 버튼을 눌러 이성이 절단한 육체의 시를 도출하십시오.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
