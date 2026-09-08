import React, { useState, useEffect } from 'react';
import { generateBorgesPage } from '../../../services/geminiService';
import { audioSynth } from '../../../services/audioSynth';
import { BookOpen, Search } from 'lucide-react';

export const BorgesLibraryV2: React.FC = () => {
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

  const renderInteractiveText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const word = part.slice(1, -1);
        return (
          <button
            key={i}
            onClick={() => handleKeywordClick(word)}
            className="inline-block mx-1 px-1.5 py-0.5 bg-stone-100 hover:bg-black text-stone-900 hover:text-white font-mono text-xs font-bold rounded border border-stone-300 transition-colors cursor-pointer"
            title={`클릭하여 '${word}' 좌표 서고로 이동`}
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
      {/* Search Coordinate Form */}
      <form onSubmit={handleManualSearch} className="flex gap-3 bg-stone-100 p-4 border border-stone-200 rounded-sm">
        <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 border border-stone-300 rounded-sm">
          <BookOpen className="w-4 h-4 text-stone-600" />
          <span className="mono text-xs font-bold text-stone-400">HEX_COORD:</span>
          <input
            type="text"
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            className="w-full font-mono text-sm text-stone-900 focus:outline-none"
            placeholder="좌표 입력 (예: 4-291-08-3)"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-black hover:bg-red-800 text-white font-mono text-xs font-bold uppercase rounded-sm shadow flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          서고 이동 (NAVIGATE)
        </button>
      </form>

      {/* Library Page Box */}
      <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-xl relative min-h-[300px]">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-6 font-mono text-xs">
          <span className="font-bold text-stone-800 uppercase">
            [HEXAGONAL_GALLERY_COORD: {coords}]
          </span>
          {currentKeyword && (
            <span className="text-stone-500 font-bold bg-stone-100 px-2 py-0.5 border border-stone-300">
              KEYWORD: "{currentKeyword}"
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 font-mono text-xs italic animate-pulse">
            무한한 바벨의 도서관 서고 좌표 텍스트 렌더링 중...
          </div>
        ) : (
          <div className="font-serif text-lg text-stone-900 leading-relaxed font-normal whitespace-pre-line">
            {renderInteractiveText(pageText)}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-stone-100 text-center font-mono text-[10px] text-stone-400 uppercase">
          * 텍스트 내부의 <span className="text-stone-900 font-bold">[대괄호 단어]</span>는 무한 서고로 이동하는 하이퍼링크입니다.
        </div>
      </div>
    </div>
  );
};
