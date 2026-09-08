import React, { useState, useEffect } from 'react';
import { generateBorgesPage } from '../../services/geminiService';
import { audioSynth } from '../../services/audioSynth';
import { BookOpen, Compass, Search } from 'lucide-react';

export const BorgesLibrary: React.FC = () => {
  const [coords, setCoords] = useState('4-291-08-3');
  const [currentKeyword, setCurrentKeyword] = useState<string | undefined>();
  const [pageText, setPageText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPage = async (targetCoords: string, kw?: string) => {
    setLoading(true);
    try {
      const text = await generateBorgesPage(targetCoords, kw);
      setPageText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(coords, currentKeyword);
  }, [coords, currentKeyword]);

  const handleKeywordClick = (kw: string) => {
    audioSynth.playClick();
    // Generate new random hex coordinate for clicked keyword
    const newCoords = `${Math.floor(Math.random() * 9 + 1)}-${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 89 + 10)}-${Math.floor(Math.random() * 9 + 1)}`;
    setCoords(newCoords);
    setCurrentKeyword(kw);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.playClick();
    setCurrentKeyword(undefined);
    fetchPage(coords);
  };

  // Render text with clickable bracketed keywords like [운명], [미궁]
  const renderInteractiveText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const word = part.slice(1, -1);
        return (
          <button
            key={i}
            onClick={() => handleKeywordClick(word)}
            className="inline-block mx-1 px-1.5 py-0.5 bg-emerald-100 hover:bg-emerald-800 text-emerald-900 hover:text-white font-mono text-xs font-bold rounded border border-emerald-400 transition-colors shadow-sm cursor-pointer"
            title={`클릭하여 '${word}'의 서고 좌표로 이동`}
          >
            [{word}]
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Hex Search Bar */}
      <form onSubmit={handleManualSearch} className="flex gap-3 bg-[#eeebd9] p-4 border-2 border-stone-800 rounded">
        <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 border border-stone-400 rounded">
          <Compass className="w-4 h-4 text-emerald-800" />
          <span className="mono text-xs font-bold text-stone-500">HEX_COORD:</span>
          <input
            type="text"
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            className="w-full font-mono text-sm text-stone-900 bg-transparent focus:outline-none"
            placeholder="예: 4-291-08-3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-stone-900 hover:bg-emerald-950 text-stone-100 font-mono text-xs font-bold uppercase rounded shadow flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          서고 이동 (Navigate Hex)
        </button>
      </form>

      {/* Library Page Display */}
      <div className="bg-[#fbfaf5] border-2 border-stone-800 p-8 rounded-sm shadow-2xl relative min-h-[300px] paper-texture">
        <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span className="font-mono text-xs font-bold text-stone-700">
              [육각형 서고 제 {coords}호]
            </span>
          </div>
          {currentKeyword && (
            <span className="font-mono text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              진입 단어: "{currentKeyword}"
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-500 font-mono text-xs italic animate-pulse">
            무한한 도서관의 서고 목록을 검색 중입니다...
          </div>
        ) : (
          <div className="font-serif text-lg text-stone-900 leading-relaxed font-normal whitespace-pre-line">
            {renderInteractiveText(pageText)}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-500 italic">
            * 텍스트 속 <span className="text-emerald-900 font-bold">[대괄호 단어]</span>를 클릭하면 바벨의 도서관 속 다른 서고 좌표로 연결됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
