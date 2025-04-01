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
    }
  };

  // 초기 재생 시작 및 안내 메시지 닫기
  const startPlayback = () => {
    setShowPlayPrompt(false);
    setHasInteracted(true);
    localStorage.setItem("weddingMusicInteracted", "true");

    // 음악 재생 시작
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .catch((error) => {
            console.log("자동 재생이 브라우저에 의해 차단되었습니다.", error);
          })
          .then(() => {
            setIsPlaying(true);
          });
      }
    }
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

      {/* 상단 컨트롤러 */}
      <div className="fixed top-0 left-0 right-0 bg-[#f1d7ef] text-black p-3 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          <p className="text-sm">
            {showPlayPrompt ? "💕 웨딩 음악과 함께 청첩장을 감상해보세요!" : "웨딩 음악"}
          </p>
        </div>

        {showPlayPrompt ? (
          <button
            onClick={startPlayback}
            className="text-black text-sm bg-white/20 px-3 py-1 rounded-full"
          >
            재생하기
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* 음소거 버튼 */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-black" />
              ) : (
                <Volume2 className="h-4 w-4 text-black" />
              )}
            </button>

            {/* 재생/일시정지 버튼 */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-black" />
              ) : (
                <Play className="h-4 w-4 text-black" />
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
