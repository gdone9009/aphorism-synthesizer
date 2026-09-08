import React, { useState } from 'react';
import { Key, ShieldCheck, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fbfaf5] border-2 border-stone-800 rounded-sm shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-stone-300 pb-4 mb-4">
          <Key className="w-6 h-6 text-red-800" />
          <h2 className="text-xl font-bold text-stone-900">Google Gemini API Key 설정</h2>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed mb-4">
          '문학 기계 박물관'은 Google의 최신 <code className="mono bg-stone-200 px-1 py-0.5 rounded text-red-900">gemini-3-flash-preview</code> 모델을 통해 다채로운 문학 텍스트를 실시간으로 생성합니다.
        </p>

        <div className="space-y-3 mb-6">
          <label className="block text-xs font-mono font-bold text-stone-700 uppercase tracking-wider">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 border-2 border-stone-400 font-mono text-sm rounded bg-white text-stone-900 focus:outline-none focus:border-stone-900"
          />
          <p className="text-xs text-stone-500 italic">
            * API 키는 서버로 전송되지 않고 오직 사용자의 브라우저 LocalStorage에 안전하게 보관됩니다.
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-6 text-xs text-amber-900">
          <span className="font-bold">💡 Tip:</span> API Key를 입력하지 않아도 <strong>'시뮬레이션 모드(Algorithmic Simulation)'</strong>로 모든 전시 기계를 자유롭게 체험할 수 있습니다!
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 uppercase"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-stone-100 font-bold text-xs uppercase tracking-wider rounded hover:bg-red-900 transition-colors shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            저장 및 적용
          </button>
        </div>
      </div>
    </div>
  );
};
