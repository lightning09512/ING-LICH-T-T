import React, { useEffect, useState } from 'react';
import { VocabItem } from '../data/initialData';
import { sounds } from '../utils/soundEffects';
import { Volume2, RotateCcw, ArrowLeft, ArrowRight, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

interface LearnVocabScreenProps {
  vocabList: VocabItem[];
  onBack: () => void;
  nickname: string;
}

export const LearnVocabScreen: React.FC<LearnVocabScreenProps> = ({
  vocabList,
  onBack,
  nickname
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const topics = ['All', ...Array.from(new Set(vocabList.map(v => v.topic)))];
  const filteredList = selectedTopic === 'All' 
    ? vocabList 
    : vocabList.filter(v => v.topic === selectedTopic);

  const currentWord = filteredList[currentIndex] || vocabList[0];

  useEffect(() => {
    if (currentWord?.word) {
      sounds.prefetchEnglish(currentWord.word);
      if (currentWord.exampleEn) sounds.prefetchEnglish(currentWord.exampleEn);
    }
    const upcoming: (string | undefined)[] = [];
    for (let offset = 1; offset <= 4; offset++) {
      const nextItem = filteredList[currentIndex + offset];
      if (nextItem) {
        upcoming.push(nextItem.word, nextItem.exampleEn);
      }
    }
    sounds.enqueuePrefetch(upcoming);
  }, [currentIndex, currentWord, filteredList]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Swipe left -> Next
    if (diff > 50) {
      handleNext();
    }
    // Swipe right -> Prev
    else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleFlip = () => {
    sounds.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    sounds.playClick();
    setIsFlipped(false);
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredList.length - 1);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    sounds.speakEnglish(currentWord.word);
  };

  const toggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCorrect();
    if (learnedIds.includes(currentWord._id)) {
      setLearnedIds(learnedIds.filter(id => id !== currentWord._id));
    } else {
      setLearnedIds([...learnedIds, currentWord._id]);
    }
  };

  const isCurrentLearned = learnedIds.includes(currentWord._id);

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => { sounds.playClick(); onBack(); }}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border-2 sm:border-3 border-black font-bold text-xs sm:text-sm shadow-neo-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Menu
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 sm:px-4 py-1.5 bg-neoGreen border-2 sm:border-3 border-black font-black text-xs sm:text-sm shadow-neo-sm min-h-[40px] flex items-center">
            ✅ Đã thuộc: {learnedIds.length}/{vocabList.length} từ
          </div>
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-3 mb-4 sm:mb-6 scrollbar-none">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => {
              sounds.playClick();
              setSelectedTopic(t);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 border-2 border-black font-bold text-xs whitespace-nowrap shadow-neo-sm transition-all min-h-[36px] ${
              selectedTopic === t ? 'bg-neoYellow -translate-y-0.5' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Flashcard Component */}
      <div className="flex flex-col items-center">
        <div
          onClick={handleFlip}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-xl md:max-w-2xl min-h-[360px] sm:min-h-[380px] md:min-h-[420px] bg-white border-3 sm:border-4 border-black p-4 sm:p-7 md:p-10 shadow-neo sm:shadow-neo-lg cursor-pointer select-none transition-all hover:-translate-y-1 relative flex flex-col justify-between"
        >
          {/* Top card bar */}
          <div className="flex items-center justify-between w-full">
            <span className="px-3 py-1 bg-neoCyan border-2 border-black text-xs font-black uppercase">
              {currentWord.topic}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">
                {currentIndex + 1} / {filteredList.length}
              </span>
              <button
                onClick={toggleLearned}
                className={`p-1.5 border-2 border-black rounded transition-all ${
                  isCurrentLearned ? 'bg-neoGreen text-black' : 'bg-gray-100 text-gray-400 hover:text-black'
                }`}
                title="Đánh dấu đã thuộc"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card Body */}
          {!isFlipped ? (
            /* Front side: English word, ipa, audio */
            <div className="my-auto py-8 text-center flex flex-col items-center gap-4">
              <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 border border-black uppercase text-gray-600">
                {currentWord.type} • {currentWord.level}
              </span>

              <h2 className="text-4xl sm:text-5xl font-black font-heading text-black tracking-wide">
                {currentWord.word}
              </h2>

              <p className="text-lg font-mono text-gray-600 font-bold">
                {currentWord.ipa}
              </p>

              <button
                onClick={handleSpeak}
                className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-neoYellow border-3 border-black font-black text-sm uppercase shadow-neo-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 group"
              >
                <Volume2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span>Nghe phát âm chuẩn</span>
              </button>

              <p className="text-xs text-gray-400 font-bold mt-2">
                (Click vào thẻ để xem nghĩa tiếng Việt & ví dụ bựa)
              </p>
            </div>
          ) : (
            /* Back side: Vietnamese translation, hilarious example */
            <div className="my-auto py-6 text-center flex flex-col items-center gap-4">
              <span className="text-xs font-bold px-3 py-1 bg-neoPink text-white border-2 border-black uppercase">
                Ý NGHĨA TIẾNG VIỆT
              </span>

              <h3 className="text-3xl sm:text-4xl font-black text-emerald-700 font-heading">
                {currentWord.meaning}
              </h3>

              <div 
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-yellow-50 border-3 border-black p-4 text-left shadow-neo-sm mt-2 flex items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    🇬🇧 "{currentWord.exampleEn}"
                  </p>
                  <p className="font-bold text-pink-700 text-sm sm:text-base mt-1">
                    🇻🇳 "{currentWord.exampleVi}"
                  </p>
                </div>
                {currentWord.exampleEn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      sounds.speakEnglish(currentWord.exampleEn);
                    }}
                    className="p-1.5 bg-white border-2 border-black rounded shadow-neo-sm hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 shrink-0 transition-all cursor-pointer"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-4 h-4 text-black" />
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 font-bold mt-2">
                (Click để lật lại mặt trước)
              </p>
            </div>
          )}

          {/* Bottom Card Hint */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-2 border-t-2 border-dashed border-gray-300">
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Lật thẻ
            </span>
            <span className="text-pink-600">
              Cố lên {nickname}! Đừng bỏ cuộc!
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-xl md:max-w-2xl flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handlePrev}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden xs:inline">Từ trước</span><span className="xs:hidden">Trước</span>
          </button>
          
          <button
            onClick={handleFlip}
            className="flex-1 flex items-center justify-center px-2.5 sm:px-6 py-2.5 sm:py-3 bg-neoPurple border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-purple-300 active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
          >
            Lật thẻ
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2.5 sm:py-3 bg-neoYellow border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
          >
            <span className="hidden xs:inline">Từ sau</span><span className="xs:hidden">Sau</span> <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
