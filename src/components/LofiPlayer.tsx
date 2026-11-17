import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, Play, Pause, SkipForward, SkipBack, 
  Volume2, VolumeX, ChevronDown, ChevronUp, 
  Radio, Disc, X, Sparkles, ExternalLink
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export interface LofiTrack {
  id: string;
  title: string;
  tag: string;
  youtubeId?: string;
  streamUrl?: string;
  durationText: string;
  emoji: string;
}

export const LOFI_TRACKS: LofiTrack[] = [
  {
    id: 'lofi_radio_direct',
    title: 'Lofi Radio 24/7 (Chạy ngầm tắt màn hình)',
    tag: 'Âm thanh trực tiếp • Vẫn phát khi khóa máy / chuyển ứng dụng',
    streamUrl: 'https://live.hunter.fm/lofi_high',
    durationText: 'Live 24/7',
    emoji: '📻'
  },
  {
    id: 'bts_lofi_1h',
    title: 'BTS Lofi Chill & Study Mix',
    tag: '1 Tiếng • Giai Điệu BTS Bản Lofi Acoustic Siêu Thư Giãn',
    youtubeId: 'sQzJYJN62QM',
    durationText: '1 Giờ',
    emoji: '💜'
  },
  {
    id: 'bts_jungkook_chill',
    title: 'BTS Jungkook - Midnight Chill Mix',
    tag: '1 Tiếng • Still With You, Euphoria, Seven Lofi Piano',
    youtubeId: 'XOaE8Plxh24',
    durationText: '1 Giờ',
    emoji: '✨'
  },
  {
    id: 'lofi_girl_study',
    title: 'Lofi Girl - Beats to Relax/Study',
    tag: 'Live Stream • #1 Học Tập & Thư Giãn Toàn Cầu',
    youtubeId: '5qap5aO4i9A',
    durationText: 'Live 24/7',
    emoji: '☕'
  },
  {
    id: 'rainy_coffee_shop',
    title: 'Rainy Coffee Shop - Chill Beats',
    tag: '2 Tiếng • Tiếng Mưa Rơi & Đàn Piano Ấm Cúng',
    youtubeId: 'P0NWkWa9NwQ',
    durationText: '2 Giờ',
    emoji: '🌧️'
  },
  {
    id: 'ghibli_chillhop',
    title: 'Ghibli Chillhop - Relaxing Mix',
    tag: '1.5 Tiếng • Giai Điệu Anime Ghibli Tuổi Thơ',
    youtubeId: 'Udh9T3DQNjo',
    durationText: '1.5 Giờ',
    emoji: '🌿'
  },
  {
    id: '1am_study_session',
    title: '1 A.M Study Session - Deep Focus',
    tag: '1 Tiếng • Nhạc Đêm Tập Trung Cao Độ',
    youtubeId: 'lTRiuFIWV54',
    durationText: '1 Giờ',
    emoji: '🌙'
  },
  {
    id: 'jazz_piano_cafe',
    title: 'Relaxing Jazz Piano Radio',
    tag: '24/7 Live • Piano Jazz Quán Cà Phê Mộc',
    youtubeId: 'Dx5qFachd3A',
    durationText: 'Live 24/7',
    emoji: '🎷'
  },
  {
    id: 'lofi_girl_sleep',
    title: 'Lofi Girl - Beats to Sleep/Chill',
    tag: 'Live Stream • Xả Stress & Giảm Căng Thẳng',
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
  const [isPillDismissed, setIsPillDismissed] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = LOFI_TRACKS[currentTrackIndex];
  const isDirectAudio = !!currentTrack.streamUrl;

  // MediaSession API setup for Lockscreen & Notification playback on phones
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: 'Ing Lịch Tét Lofi Chill',
        album: 'Nhạc Học Bài TOEIC',
        artwork: [
          { src: '/trollface.png', sizes: '96x96', type: 'image/png' },
          { src: '/trollface.png', sizes: '256x256', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => handlePlay());
      navigator.mediaSession.setActionHandler('pause', () => handlePause());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    }
  }, [currentTrack]);

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

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPillDismissed(false);
    if (isDirectAudio) {
      // Pause YouTube if playing
      sendIframeCommand('pauseVideo');
      audioRef.current?.play().catch(() => {});
    } else {
      // Pause Direct Audio if playing
      audioRef.current?.pause();
      sendIframeCommand('playVideo');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (isDirectAudio) {
      audioRef.current?.pause();
    } else {
      sendIframeCommand('pauseVideo');
    }
  };

  const togglePlay = () => {
    sounds.playClick();
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Change Track
  const handleSelectTrack = (index: number) => {
    sounds.playClick();
    const targetTrack = LOFI_TRACKS[index];
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setIsPillDismissed(false);

    if (targetTrack.streamUrl) {
      sendIframeCommand('pauseVideo');
      if (audioRef.current) {
        audioRef.current.src = targetTrack.streamUrl;
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Wait next tick for iframe to update key/src
      setTimeout(() => {
        sendIframeCommand('playVideo');
      }, 300);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    const nextIdx = (currentTrackIndex + 1) % LOFI_TRACKS.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrev = () => {
    sounds.playClick();
    const prevIdx = (currentTrackIndex - 1 + LOFI_TRACKS.length) % LOFI_TRACKS.length;
    handleSelectTrack(prevIdx);
  };

  // Adjust volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    const effectiveVol = newVol / 100;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }

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
      if (audioRef.current) audioRef.current.muted = false;
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [volume || 50]);
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.muted = true;
      sendIframeCommand('mute');
    }
  };

  return (
    <>
      {/* 1. NATIVE HTML5 AUDIO ELEMENT (Permanent, never unmounted, background lockscreen support) */}
      <audio
        ref={audioRef}
        src={currentTrack.streamUrl || undefined}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (isDirectAudio) setIsPlaying(false);
        }}
      />

      {/* 2. FLOATING MINI PILL (Always visible when boombox is closed, NEVER stops playing) */}
      {!isOpen && !isPillDismissed && (
        <div className="fixed bottom-16 sm:bottom-4 right-2.5 sm:right-4 z-40 flex items-center gap-2">
          <div className="flex items-center bg-neoYellow border-2 sm:border-3 border-black rounded-full shadow-neo pl-3 pr-1.5 sm:pl-3.5 sm:pr-2 py-1 sm:py-1.5 transition-all max-w-[calc(100vw-20px)]">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleOpen();
              }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer text-left group min-w-0"
              title="Mở bảng điều khiển Lofi"
            >
              <div className="relative shrink-0">
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:rotate-12 transition-transform" />
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full animate-ping" />
                )}
              </div>

              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-800 leading-none">
                    Lofi Chill
                  </span>
                  {isPlaying && (
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-black text-black max-w-[110px] xs:max-w-[140px] sm:max-w-[170px] truncate leading-tight">
                  {currentTrack.emoji} {currentTrack.title}
                </span>
              </div>
            </button>

            {/* Quick Play/Pause on pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-1 sm:p-1.5 bg-white border-2 border-black rounded-full shadow-neo-sm hover:bg-gray-100 active:scale-90 transition-transform ml-1.5 sm:ml-2 shrink-0"
              title={isPlaying ? "Tạm dừng" : "Tiếp tục phát"}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
              ) : (
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black ml-0.5" />
              )}
            </button>

            {/* Dismiss Pill (Can still reopen from top Navbar anytime) */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsPillDismissed(true);
              }}
              className="p-1 text-gray-500 hover:text-black ml-0.5 cursor-pointer shrink-0"
              title="Ẩn nút nổi (nhạc vẫn phát ngầm, mở lại từ thanh Menu trên cùng)"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. EXPANDED BOOMBOX CARD (ALWAYS IN DOM, only hidden via CSS so audio NEVER reloads or stops!) */}
      <div
        className={`fixed bottom-16 sm:bottom-4 right-2.5 sm:right-4 z-50 w-[calc(100vw-20px)] max-w-[350px] sm:max-w-[360px] max-h-[82dvh] bg-white border-3 sm:border-4 border-black rounded-2xl shadow-neo-lg flex flex-col overflow-hidden transition-all duration-200 ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0 visible'
            : 'opacity-0 scale-95 pointer-events-none translate-y-8 invisible'
        }`}
      >
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
              className="w-7 h-7 bg-white border-2 border-black rounded hover:bg-gray-100 font-bold flex items-center justify-center text-xs shadow-neo-sm cursor-pointer"
              title="Thu nhỏ lại thành nút nổi (nhạc vẫn phát ngầm)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleOpen();
              }}
              className="w-7 h-7 bg-neoPink text-white border-2 border-black rounded hover:bg-pink-600 font-black flex items-center justify-center text-xs shadow-neo-sm cursor-pointer"
              title="Đóng bảng điều khiển (nhạc vẫn tiếp tục chạy)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Frame: YouTube Embed or Radio Graphic (Kept mounted inside DOM so playback NEVER resets) */}
        <div className="relative bg-black w-full h-[190px] border-b-3 border-black overflow-hidden flex items-center justify-center">
          {/* YouTube IFrame (Always mounted when track has youtubeId) */}
          <iframe
            ref={iframeRef}
            src={currentTrack.youtubeId ? `https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=0&loop=1&playlist=${currentTrack.youtubeId}&playsinline=1` : undefined}
            title={currentTrack.title}
            className={`w-full h-full border-none ${isDirectAudio ? 'hidden' : 'block'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Radio Animated Poster for Direct Audio Stream */}
          {isDirectAudio && (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center text-white p-4 text-center">
              <div className="relative mb-2">
                <Disc className={`w-14 h-14 text-yellow-300 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                <span className="absolute inset-0 flex items-center justify-center text-xl">☕</span>
              </div>
              <h5 className="font-heading font-black text-sm text-yellow-300">
                Lofi Radio Trực Tuyến 24/7
              </h5>
              <p className="text-[11px] text-gray-300 font-medium mt-1">
                🎧 Chuẩn stream âm thanh chạy ngầm kể cả khi khóa màn hình điện thoại
              </p>
            </div>
          )}
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
              className="p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:bg-gray-100 active:scale-95 transition-transform cursor-pointer"
              title="Bài trước"
            >
              <SkipBack className="w-4 h-4 fill-black" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 bg-neoYellow border-3 border-black rounded-xl shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
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
              className="p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:bg-gray-100 active:scale-95 transition-transform cursor-pointer"
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
            className="w-full py-1.5 px-3 bg-white border-2 border-black rounded-lg font-bold text-xs flex items-center justify-between shadow-neo-sm hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-pink-600" />
              Danh sách bài ({LOFI_TRACKS.length} list chill)
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
            🎧 Đóng bảng điều khiển nhạc vẫn phát xuyên suốt nha {nickname}!
          </div>
        </div>
      </div>
    </>
  );
};
