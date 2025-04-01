"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Copy, Share } from "lucide-react";
import Image from "next/image";

export default function ShareButtons() {
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);

  // 카카오 SDK 초기화
  useEffect(() => {
    // 카카오 SDK 스크립트가 이미 로드되어 있는지 확인
    const kakaoScript = document.getElementById("kakao-sdk");

    if (!kakaoScript) {
      // 카카오 SDK 스크립트 로드
      const script = document.createElement("script");
      script.id = "kakao-sdk";
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      script.onload = () => initializeKakao();

      document.head.appendChild(script);
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      // 스크립트는 로드되었지만 초기화되지 않은 경우
      initializeKakao();
    } else if (window.Kakao && window.Kakao.isInitialized()) {
      // 이미 초기화된 경우
      setIsKakaoInitialized(true);
    }
  }, []);

  // 카카오 SDK 초기화 함수
  const initializeKakao = () => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // JavaScript 키를 사용해 초기화
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
      }
      setIsKakaoInitialized(true);
    }
  };

  // URL 복사 기능
  const copyUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success("URL이 복사되었습니다!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });
    } catch (err) {
      console.error("URL 복사 실패:", err);
      toast.error("URL 복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 카카오톡 공유하기
  const shareToKakao = () => {
    if (!window.Kakao || !isKakaoInitialized) {
      toast.error("카카오톡 공유 기능을 로드하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "손승호 ♥ 고유미 결혼식에 초대합니다",
          description: "2025년 5월 31일 토요일 오후 1시 20분, 스타시티아트홀",
          imageUrl:
            "https://imagedelivery.net/pHTjzIlCpzQ9LDxmdhUMHQ/0aa8d68d-0ca7-41f3-8a83-76ef9c29ff00/public",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } catch (error) {
      console.error("카카오톡 공유 실패:", error);
      toast.error("카카오톡 공유에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <footer className="w-full bg-[#f1d7ef] py-8 border-t border-[#ee7685]/20 pb-16">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md mx-auto px-6">
        {/*<div className="flex flex-col items-center">
          <p className="text-gray-600 mb-6 text-center">소중한 분들에게 청첩장을 공유해보세요</p>
          <div className="flex gap-4">
            <button
              onClick={copyUrl}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg border border-gray-200 shadow-sm transition-colors"
            >
              <Copy size={18} />
              <span className="font-medium">URL 복사</span>
            </button>

            <button
              onClick={shareToKakao}
              className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD900] text-[#3C1E1E] px-5 py-3 rounded-lg border border-[#DDCB00] shadow-sm transition-colors"
            >
              <div className="w-5 h-5 relative">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M12,3C6.486,3,2,6.462,2,10.826c0,2.886,1.92,5.415,4.769,6.837l-1.221,4.526c-0.104,0.387,0.347,0.688,0.676,0.452l5.328-3.881c0.153,0.013,0.308,0.019,0.462,0.019c5.514,0,10-3.462,10-7.826C22,6.462,17.514,3,12,3z"
                  />
                </svg>
              </div>
              <span className="font-medium">카카오톡 공유</span>
            </button>
          </div>
        </div> */}

        {/* 카피라이트 */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="mb-1">소중한 시간 내어 저희의 결혼을 축복해주셔서 감사합니다</p>
          <p>함께할 행복한 여정에 여러분의 따뜻한 마음을 잊지 않겠습니다 💕</p>
        </div>
      </div>
    </footer>
  );
}
