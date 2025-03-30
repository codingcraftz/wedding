"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(true); // 초기 재생 안내 표시
  const audioRef = useRef(null);

  // 사용자 상호작용 여부를 localStorage에 저장하고 확인
  useEffect(() => {
    // localStorage에서 사용자 상호작용 여부 확인
    const userHasInteracted = localStorage.getItem("weddingMusicInteracted") === "true";
    setHasInteracted(userHasInteracted);

    // 이미 상호작용한 경우 안내 메시지 숨김
    if (userHasInteracted) {
      setShowPlayPrompt(false);
    }
  }, []);

  // 재생/일시정지 토글 함수
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // 모바일에서는 사용자 상호작용 후 재생이 가능함
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // 자동 재생이 차단된 경우 처리
          console.log("자동 재생이 브라우저에 의해 차단되었습니다.", error);
        });
      }
    }

    // 처음 상호작용 시 localStorage에 저장
    if (!hasInteracted) {
      localStorage.setItem("weddingMusicInteracted", "true");
      setHasInteracted(true);
      setShowPlayPrompt(false);
    }

    setIsPlaying(!isPlaying);
  };

  // 음소거 토글 함수
  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);

    // 처음 상호작용 시 localStorage에 저장
    if (!hasInteracted) {
      localStorage.setItem("weddingMusicInteracted", "true");
      setHasInteracted(true);
      setShowPlayPrompt(false);
    }
  };

  // 초기 재생 안내 메시지 닫기
  const dismissPlayPrompt = () => {
    setShowPlayPrompt(false);
  };

  // 오디오 로드 시 이벤트 리스너 추가
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 오디오 재생 완료 시 처리
    const handleEnded = () => {
      // 루프가 설정되어 있지만 만약을 위한 백업 처리
      setIsPlaying(false);
      audio.currentTime = 0;
      audio.play().catch(() => {});
      setIsPlaying(true);
    };

    // 이벤트 리스너 등록
    audio.addEventListener("ended", handleEnded);

    // 클린업 함수
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  return (
    <>
      {/* 숨겨진 오디오 요소 */}
      <audio ref={audioRef} src="/audio/wedding-music.mp3" preload="auto" loop />

      {/* 초기 재생 안내 메시지 */}
      {showPlayPrompt && (
        <div className="fixed top-0 left-0 right-0 bg-[#ee7685] text-white p-3 z-50 flex justify-between items-center">
          <p className="text-sm">💕 웨딩 음악과 함께 청첩장을 감상해보세요!</p>
          <button
            onClick={dismissPlayPrompt}
            className="text-white text-sm bg-white/20 px-2 py-1 rounded"
          >
            확인
          </button>
        </div>
      )}

      {/* 플레이어 UI - 화면 하단에 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md border-t border-[#ee7685]/20 p-2 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-[#ee7685]" />
            <span className="text-sm text-[#ee7685] font-medium">웨딩 음악</span>
          </div>

          <div className="flex items-center gap-3">
            {/* 음소거 버튼 */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-[#ee7685]/10 hover:bg-[#ee7685]/20 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-[#ee7685]" />
              ) : (
                <Volume2 className="h-4 w-4 text-[#ee7685]" />
              )}
            </button>

            {/* 재생/일시정지 버튼 */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-[#ee7685] hover:bg-[#d35e6c] transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
