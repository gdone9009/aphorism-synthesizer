import React, { useState, useEffect, useRef } from 'react';
import { Play, Network } from 'lucide-react';
import { audioSynth } from '../../../services/audioSynth';

const DEFAULT_CORPUS_V3 = `어느 날 온 몸이 황금빛인 고양이를 보았다.
고양이는 창문틀 위에서 햇살을 받으며 조용히 눈을 감고 있었다.
그것은 단순한 동물이 아니라 시간을 자르는 정교한 사슬이었다.
사슬은 별빛 속에서 고요히 반짝였다.`;

interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: { [target: string]: number };
}

export const MarkovMachineV3: React.FC = () => {
  const [corpus, setCorpus] = useState(DEFAULT_CORPUS_V3);
  const [generatedText, setGeneratedText] = useState('');
  const [nGram, setNGram] = useState<number>(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  console.log(activeNode);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const animIdRef = useRef<number | null>(null);

  const buildGraphAndMatrix = () => {
    audioSynth.playLever();
    const words = corpus.trim().split(/\s+/);
    const matrix: { [key: string]: { [key: string]: number } } = {};

    for (let i = 0; i < words.length - nGram; i++) {
      const key = words.slice(i, i + nGram).join(' ');
      const nextWord = words[i + nGram];
      if (!matrix[key]) matrix[key] = {};
      matrix[key][nextWord] = (matrix[key][nextWord] || 0) + 1;
    }

    const keys = Object.keys(matrix);
    const canvas = canvasRef.current;
    const width = canvas?.width || 650;
    const height = canvas?.height || 350;

    const graphNodes: GraphNode[] = keys.map((key, idx) => {
      const angle = (idx / keys.length) * Math.PI * 2;
      const radius = 130;
      return {
        id: key,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        connections: matrix[key],
      };
    });

    nodesRef.current = graphNodes;

    if (keys.length > 0) {
      const current = keys[Math.floor(Math.random() * keys.length)];
      setActiveNode(current);
      const result = [current];

      let temp = current;
      for (let i = 0; i < 20; i++) {
        const nexts = matrix[temp];
        if (!nexts) break;
        const options = Object.keys(nexts);
        const chosen = options[Math.floor(Math.random() * options.length)];
        result.push(chosen);
        temp = chosen;
      }
      setGeneratedText(result.join(' '));
    }
  };

  useEffect(() => {
    buildGraphAndMatrix();
  }, [nGram]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 650;
    canvas.height = 360;

    const render = () => {
      ctx.fillStyle = '#fcfbf7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;

      nodes.forEach((node) => {
        Object.entries(node.connections).forEach(([targetId, weight]) => {
          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = activeNode === node.id ? 'rgba(220, 38, 38, 0.8)' : 'rgba(168, 162, 158, 0.4)';
            ctx.lineWidth = Math.min(4, weight);
            ctx.stroke();
          }
        });
      });

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = activeNode === node.id ? '#dc2626' : '#1c1917';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id.slice(0, 4), node.x, node.y);
      });

      animIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [activeNode]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            1. 입력 코퍼스 (Corpus Input)
          </label>
          <textarea
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            rows={6}
            className="w-full p-3 font-serif text-sm border-2 border-stone-800 rounded bg-white text-stone-900 focus:outline-none"
          />
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-mono text-stone-600 font-bold">N-Gram 크기:</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { audioSynth.playClick(); setNGram(n); }}
                className={`px-3 py-1 text-xs font-mono font-bold border rounded ${
                  nGram === n ? 'bg-stone-950 text-white border-stone-950 shadow' : 'bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {n}-Gram
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-2">
            2. 마르코프 사슬 생성 텍스트 (Stochastic Result)
          </label>
          <div className="w-full h-44 p-4 font-serif text-base border-2 border-stone-900 bg-[#f4f1e8] rounded text-stone-900 overflow-y-auto leading-relaxed shadow-inner">
            {generatedText ? (
              <p className="animate-fade-in font-medium">{generatedText}</p>
            ) : (
              <p className="text-stone-400 italic text-sm">
                버튼을 눌러 마르코프 확률 사슬 연쇄를 생성하십시오.
              </p>
            )}
          </div>

          <button
            onClick={buildGraphAndMatrix}
            className="mt-4 w-full py-3.5 bg-red-950 hover:bg-black text-amber-200 font-mono font-bold uppercase tracking-widest text-xs rounded shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 text-amber-400" />
            마르코프 사슬 & 방향성 그래프 시뮬레이션
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-stone-900 p-4 rounded shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-3">
          <span className="font-mono text-xs font-bold text-stone-900 uppercase flex items-center gap-1.5">
            <Network className="w-4 h-4 text-red-700" />
            DIRECTED_MARKOV_NODE_GRAPH (실시간 단어 전이 확률 노드 그래프)
          </span>
          <span className="font-mono text-[10px] text-stone-400">NODES: {nodesRef.current.length}</span>
        </div>

        <canvas ref={canvasRef} className="w-full block rounded border border-stone-200" />
      </div>
    </div>
  );
};
