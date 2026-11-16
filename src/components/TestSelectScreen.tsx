import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import { 
  ArrowLeft, Clock, Target, Volume2, Award, Sparkles, 
  BookOpen, ChevronRight, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface TestSummary {
  _id: string;
  title: string;
  code: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
}

interface TestSelectScreenProps {
  onSelectTest: (testId: string) => void;
  onBack: () => void;
  nickname: string;
}

const fallbackTests: TestSummary[] = [
  {
    _id: 'test-1',
    title: 'Full Test 1 - ETS TOEIC 2022 (Study4)',
    code: 'ETS2022-T1',
    durationMinutes: 120,
    totalQuestions: 200,
    description: 'Đề thi đầy đủ 200 câu Part 1 - 7 chuẩn cấu trúc ETS 2022 format mới nhất có Audio bản quyền Study4'
  }
];

export const TestSelectScreen: React.FC<TestSelectScreenProps> = ({
  onSelectTest,
  onBack,
  nickname
}) => {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tests')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const fullTests = data.data.filter((t: TestSummary) => t.totalQuestions >= 100);
          setTests(fullTests.length > 0 ? fullTests : fallbackTests);
        } else {
          setTests(fallbackTests);
        }
      })
      .catch(() => {
        setTests(fallbackTests);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 md:py-10 pb-24">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-black text-sm uppercase shadow-neo-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Menu
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-black flex items-center gap-3">
            <span>📚 Kho Đề Thi TOEIC</span>
            <span className="text-base font-bold bg-neoYellow border-2 border-black px-3 py-1 shadow-neo-sm rotate-2">
              {tests.length} đề thi
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-1">
            Chọn đề thi để thử thách bản thân nào {nickname}! Đầy đủ Audio Listening + Đáp án chi tiết.
          </p>
        </div>

        <div className="shrink-0 bg-neoPink text-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-neo-sm">
          🔥 Chuẩn Quốc Tế 200 Câu
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="bg-white border-4 border-black p-12 text-center shadow-neo-lg">
          <div className="inline-block animate-spin text-4xl mb-3">🌀</div>
          <p className="text-xl font-black font-heading">Đang tải danh sách đề thi...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white border-4 border-black p-10 text-center shadow-neo-lg">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <h3 className="text-xl font-black">Chưa có đề thi nào trong danh mục!</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {tests.map((t, idx) => {
            return (
              <div
                key={t._id}
                className="bg-white border-4 border-black p-5 sm:p-6 shadow-neo-lg hover:shadow-neo hover:-translate-y-1 transition-all flex flex-col justify-between relative group"
              >
                {/* Header Tag */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-black uppercase border-2 border-black shadow-neo-sm bg-neoPink text-white rotate-[-1deg]">
                    🔥 Đề Full 200 Câu Chuẩn
                  </span>
                  <span className="text-xs font-black bg-gray-100 border border-black px-2 py-0.5 font-mono">
                    {t.code}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-black font-heading group-hover:text-neoPink transition-colors leading-tight mb-2">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-600 line-clamp-2">
                    {t.description}
                  </p>
                </div>

                {/* Badges Info */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-black text-xs font-black">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    {t.durationMinutes} phút
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 border border-black text-xs font-black">
                    <Target className="w-3.5 h-3.5 text-blue-700" />
                    {t.totalQuestions} câu hỏi
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 border border-black text-xs font-black">
                    <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                    Audio Authentic
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectTest(t._id);
                  }}
                  className="w-full py-3.5 px-4 bg-neoYellow hover:bg-yellow-400 border-3 border-black font-black text-sm sm:text-base uppercase shadow-neo-sm hover:shadow-neo active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:bg-neoPink group-hover:text-white"
                >
                  <span>Bắt Đầu Làm Bài</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
