import React, { useState } from 'react';
import { Download, X, Printer, Check } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

interface ArtifactExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactExporterModal: React.FC<ArtifactExporterModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [artifactTitle, setArtifactTitle] = useState('사이버네틱 문학 판화 #410');
  const [authorName, setAuthorName] = useState('인간 저자 & Gemini 3 Flash');
  const [content, setContent] = useState(`[사이버네틱 원고 전사]

밤이 깊어지자 도서관의 마지막 사서는 열쇠를 쥔 채 서고 중앙의 고풍스러운 기계 앞에 섰다. 
확률 사슬의 N-Gram 0.42 지점에서 문장의 유령이 솟구쳐 올랐고, 
우리는 침묵 속에서 별빛과 회로가 하나로 보간되는 기적을 목도하였다.

- 문학 기계 박물관 2026 아카이브 기록 -`);

  if (!isOpen) return null;

  const handlePrint = () => {
    audioSynth.playLever();
    window.print();
  };

  const handleCopy = () => {
    audioSynth.playClick();
    navigator.clipboard.writeText(`${artifactTitle}\n저자: ${authorName}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#fbfaf5] border-2 border-stone-900 rounded-sm shadow-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-stone-900">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b-2 border-stone-900 pb-4 mb-6">
          <Download className="w-6 h-6 text-amber-900" />
          <div>
            <h2 className="text-xl font-bold text-stone-950 uppercase tracking-tight">
              사이버네틱 문학 원고/판화 내보내기 (ARTIFACT EXPORTER)
            </h2>
            <p className="text-xs text-stone-600 font-serif">
              기계가 생성한 원고를 고해상도 양파껍질 종이 판화 서식으로 인쇄하거나 텍스트로 저장합니다.
            </p>
          </div>
        </div>

        {/* Edit fields */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">판화 제목</label>
            <input
              type="text"
              value={artifactTitle}
              onChange={(e) => setArtifactTitle(e.target.value)}
              className="w-full p-2 font-serif text-sm border border-stone-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">공동 저자명</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-2 font-serif text-sm border border-stone-300 rounded bg-white"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">원고 본문</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full p-3 font-serif text-sm border border-stone-300 rounded bg-white leading-relaxed"
          />
        </div>

        {/* Vintage Parchment Artifact Preview */}
        <div className="bg-[#f2efe4] border-2 border-stone-800 p-8 rounded-sm shadow-xl relative font-serif mb-6 paper-texture">
          {/* Stamp Watermark */}
          <div className="absolute top-4 right-6 border-2 border-red-800/40 text-red-900/40 p-2 font-mono text-[9px] uppercase tracking-widest font-black rotate-12 pointer-events-none select-none">
            MUSEUM_VERIFIED_ARTIFACT<br />2026-09-08
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-1 border-b border-stone-300 pb-2">
            {artifactTitle}
          </h3>
          <p className="text-xs italic text-stone-600 mb-4 font-mono">
            AUTHOR: {authorName}
          </p>

          <div className="text-sm text-stone-900 leading-loose whitespace-pre-line font-medium mb-6">
            {content}
          </div>

          <div className="pt-4 border-t border-stone-300 flex justify-between items-center text-[10px] font-mono text-stone-500">
            <span>PROBABILITY_MATRIX: VERIFIED</span>
            <span>THE_MUSEUM_OF_LITERARY_MACHINES_V3</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 font-mono text-xs font-bold rounded uppercase"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Download className="w-4 h-4" />}
            {copied ? '복사 완료!' : '텍스트 복사'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-black text-white font-mono text-xs font-bold rounded uppercase shadow"
          >
            <Printer className="w-4 h-4" /> 판화 인쇄 (Print Artifact)
          </button>
        </div>
      </div>
    </div>
  );
};
