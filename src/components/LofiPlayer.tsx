import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, Play, Pause, SkipForward, SkipBack, 
  Volume2, VolumeX, ChevronDown, ChevronUp, Music, 
  Radio, Disc, X, Sparkles 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export interface LofiTrack {
  id: string;
  title: string;
  tag: string;
  youtubeId: string;
  durationText: string;
  emoji: string;
}

export const LOFI_TRACKS: LofiTrack[] = [
  {
    id: 'lofi_girl_study',
    title: 'Lofi Girl - Beats to Relax/Study',
    tag: '24/7 Live Stream • #1 Học Tập Toàn Cầu',
    youtubeId: '5qap5aO4i9A',
    durationText: 'Live 24/7',
    emoji: '☕'
  },
  {
    id: 'rainy_coffee_shop',
    title: 'Rainy Coffee Shop - Chill Beats',
    tag: '2 Tiếng • Tiếng Mưa Rơi & Piano Êm Đềm',
    youtubeId: 'P0NWkWa9NwQ',
    durationText: '2 Giờ',
    emoji: '🌧️'
  },
  {
    id: 'ghibli_chillhop',
    title: 'Ghibli Chillhop - Relaxing Mix',
    tag: '1.5 Tiếng • Nhạc Anime Ghibli Thư Thái',
    youtubeId: 'Udh9T3DQNjo',
    durationText: '1.5 Giờ',
    emoji: '🌿'
  },
  {
    id: '1am_study_session',
    title: '1 A.M Study Session - Deep Focus',
    tag: '1 Tiếng • Tập Trung Cao Độ Đêm Muộn',
    youtubeId: 'lTRiuFIWV54',
    durationText: '1 Giờ',
    emoji: '🌙'
  },
  {
    id: 'jazz_piano_cafe',
    title: 'Relaxing Jazz Piano Radio',
    tag: '24/7 Live • Piano Jazz Quán Cà Phê',
    youtubeId: 'Dx5qFachd3A',
    durationText: 'Live 24/7',
    emoji: '🎷'
  },
  {
    id: 'lofi_girl_sleep',
    title: 'Lofi Girl - Beats to Sleep/Chill',
    tag: '24/7 Live • Thư Giãn, Giảm Stress',
    youtubeId: 'DWcJFNfaw9c',
    durationText: 'Live 24/7',
    emoji: '💤'
  }
];

interface LofiPlayerProps {
  nickname: string;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const LofiPlayer: React.FC<LofiPlayerProps> = ({
  nickname,
  isOpen,
  onToggleOpen
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentTrack = LOFI_TRACKS[currentTrackIndex];

  // Send postMessage to YouTube IFrame API
  const sendIframeCommand = (command: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: args
        }),
        '*'
      );
    }
  };

  // Handle Play/Pause
  const togglePlay = () => {
    sounds.playClick();
    if (isPlaying) {
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  // Switch Track
  const handleSelectTrack = (index: number) => {
    sounds.playClick();
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % LOFI_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length);
    setIsPlaying(true);
  };

  // Adjust volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      sendIframeCommand('mute');
    } else {
      setIsMuted(false);
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [newVol]);
    }
  };

  const toggleMute = () => {
    sounds.playClick();
    if (isMuted) {
      setIsMuted(false);
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [volume || 50]);
    } else {
      setIsMuted(true);
      sendIframeCommand('mute');
    }
  };

  return (
    <>
      {/* Hidden/Active YouTube IFrame (always mounted in background so music continues across pages) */}
      <div className={isOpen && showVideo ? "block mb-2" : "hidden"}>
        {/* Rendered inside the expanded card below */}
      </div>

      {/* 1. FLOATING MINI PILL (Always accessible in bottom right when minimized) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onToggleOpen();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-neoYellow border-3 border-black rounded-full shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer group"
            title="Mở bảng phát nhạc Lofi Chill"
          >
            <div className="relative">
              <Headphones className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-800 leading-none">
                Lofi Chill
              </span>
              <span className="text-xs font-black text-black max-w-[130px] sm:max-w-[170px] truncate leading-tight">
                {currentTrack.emoji} {currentTrack.title}
              </span>
            </div>

            {/* Quick Play/Pause on pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-1.5 bg-white border-2 border-black rounded-full shadow-neo-sm hover:bg-gray-100 active:scale-90 transition-transform ml-1"
              title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-black" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              )}
            </button>
          </button>
        </div>
      )}

      {/* 2. EXPANDED BOOMBOX CARD (Floating Retro Cassette / Walkman UI) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[320px] sm:w-[360px] bg-white border-4 border-black rounded-2xl shadow-neo-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header Bar */}
          <div className="bg-neoYellow border-b-3 border-black px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-black animate-pulse" />
              <span className="font-heading font-black text-sm uppercase tracking-wide">
                Góc Nhạc Lofi Chill
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleOpen();
                }}
                className="w-7 h-7 bg-white border-2 border-black rounded hover:bg-gray-100 font-bold flex items-center justify-center text-xs shadow-neo-sm"
                title="Thu nhỏ thành nút nổi"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleOpen();
                }}
                className="w-7 h-7 bg-neoPink text-white border-2 border-black rounded hover:bg-pink-600 font-black flex items-center justify-center text-xs shadow-neo-sm"
                title="Đóng bảng nhạc"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* YouTube Iframe Viewport */}
          <div className="relative bg-black w-full h-[190px] border-b-3 border-black overflow-hidden flex items-center justify-center">
            <iframe
              ref={iframeRef}
              key={currentTrack.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${currentTrack.youtubeId}&playsinline=1`}
              title={currentTrack.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Player Body & Controls */}
          <div className="p-3.5 sm:p-4 bg-yellow-50/50 flex flex-col gap-3">
            {/* Current Track Info */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{currentTrack.emoji}</span>
                  <h4 className="font-black text-sm text-black truncate leading-tight">
                    {currentTrack.title}
                  </h4>
                </div>
                <p className="text-[11px] font-bold text-gray-600 truncate mt-0.5">
                  {currentTrack.tag}
                </p>
              </div>

              {/* Status Indicator */}
              <span className={`px-2 py-0.5 text-[10px] font-black border border-black rounded-full shrink-0 ${
                isPlaying ? 'bg-neoGreen text-black animate-pulse' : 'bg-gray-200 text-gray-600'
              }`}>
                {isPlaying ? 'ĐANG PHÁT' : 'TẠM DỪNG'}
              </span>
            </div>

            {/* Media Control Buttons */}
            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={handlePrev}
                className="p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:bg-gray-100 active:scale-95 transition-transform"
                title="Bài trước"
              >
                <SkipBack className="w-4 h-4 fill-black" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-neoYellow border-3 border-black rounded-xl shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-black" />
                ) : (
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:bg-gray-100 active:scale-95 transition-transform"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-4 h-4 fill-black" />
              </button>
            </div>

            {/* Volume Control Slider */}
            <div className="flex items-center gap-2 px-1">
              <button
                onClick={toggleMute}
                className="text-gray-700 hover:text-black cursor-pointer"
                title={isMuted ? "Bật âm" : "Tắt âm"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer h-1.5 bg-gray-300 rounded-lg appearance-none"
              />
              <span className="text-[10px] font-mono font-bold text-gray-600 w-7 text-right">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>

            {/* Playlist Accordion Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowPlaylist(!showPlaylist);
              }}
              className="w-full py-1.5 px-3 bg-white border-2 border-black rounded-lg font-bold text-xs flex items-center justify-between shadow-neo-sm hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-pink-600" />
                Danh sách bài ({LOFI_TRACKS.length} list chill 1-2h)
              </span>
              {showPlaylist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Playlist List (Expandable) */}
            {showPlaylist && (
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                {LOFI_TRACKS.map((track, idx) => (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`p-2 border-2 border-black rounded-lg cursor-pointer flex items-center justify-between text-xs transition-all ${
                      currentTrackIndex === idx
                        ? 'bg-neoYellow shadow-neo-sm font-black'
                        : 'bg-white hover:bg-yellow-50 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{track.emoji}</span>
                      <div className="truncate">
                        <p className="truncate leading-tight">{track.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium truncate">{track.tag}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-black text-white rounded font-mono shrink-0 ml-1">
                      {track.durationText}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Troll Study Encouragement */}
            <div className="text-center text-[11px] font-bold text-gray-500 italic border-t border-dashed border-gray-300 pt-2">
              🎧 Bật lofi lên mà tập trung cày TOEIC 800+ nha {nickname}!
            </div>
          </div>
        </div>
      )}
    </>
  );
};
