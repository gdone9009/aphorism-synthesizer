import React, { useState } from 'react';
import { Key, ShieldCheck, X, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#fbfaf5] border-2 border-stone-800 rounded-sm shadow-2xl max-w-xl w-full p-6 md:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-stone-800 pb-4 mb-5">
          <Key className="w-6 h-6 text-red-800" />
          <div>
            <h2 className="text-xl font-bold text-stone-900">Google Gemini API Key 설정</h2>
            <p className="text-xs text-stone-500 font-mono">MODEL: gemini-3-flash-preview</p>
          </div>
        </div>

        {/* Direct Link to Google AI Studio */}
        <div className="bg-emerald-50 border-2 border-emerald-600 p-4 rounded mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-950 uppercase font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" /> 10초 만에 무료 API Key 발급받기
            </span>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs font-bold rounded shadow transition-all hover:scale-105"
            >
              Google AI Studio 바로가기 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-serif">
            Google AI Studio는 구글 계정만 있으면 <strong>100% 무료</strong>로 개인 API Key를 발급해 줍니다.
          </p>
        </div>

        {/* Step-by-step Instructions */}
        <div className="bg-stone-100 p-4 rounded border border-stone-300 mb-6 space-y-2 text-xs font-serif text-stone-800">
          <div className="font-mono font-bold text-stone-700 uppercase flex items-center gap-1 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" /> API Key 발급 순서 (3-Step Guide)
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>위의 <strong>[Google AI Studio 바로가기]</strong> 버튼을 눌러 사이트에 접속 후 로그인합니다.</li>
            <li>화면 좌측 메뉴의 <strong>[Get API key]</strong> → <strong>[Create API key]</strong> 버튼을 클릭합니다.</li>
            <li>생성된 <code className="font-mono bg-stone-200 px-1 py-0.5 rounded text-red-900">AIzaSy...</code> 형식의 Key 문자열을 복사하여 아래에 붙여넣고 저장하세요!</li>
          </ol>
        </div>

        {/* Input Box */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-mono font-bold text-stone-700 uppercase tracking-wider">
            Gemini API Key 입력
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2.5 border-2 border-stone-400 font-mono text-sm rounded bg-white text-stone-900 focus:outline-none focus:border-stone-900"
          />
          <p className="text-xs text-stone-500 italic">
            * 입력하신 API 키는 서버로 전송되지 않으며, 오직 본인 브라우저(LocalStorage)에만 안전하게 보관됩니다.
          </p>
        </div>

        {/* Simulation Tip */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-6 text-xs text-amber-950 font-serif">
          <span className="font-bold font-mono">💡 Tip:</span> API Key를 입력하지 않더라도 <strong>시뮬레이션 모드(Algorithmic Simulation)</strong>로 9개 기계 모두 즉시 체험하실 수 있습니다.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-stone-600 hover:text-stone-900 uppercase"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-stone-100 font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-red-900 transition-colors shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            저장 및 적용 (Save Key)
          </button>
        </div>
      </div>
    </div>
  );
};
