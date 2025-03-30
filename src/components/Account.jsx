"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Noto_Sans_KR } from "next/font/google";
import { Gamja_Flower } from "next/font/google";

// 노토 산스 폰트 (무난하고 가독성 좋은 폰트)
const notoSans = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const gamjaFlower = Gamja_Flower({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

// 신랑측 계좌 정보 (두 계좌)
const groomAccounts = [
  {
    name: "손삼익",
    bank: "국민은행",
    accountNumber: "640-21-0172-719",
    tossUrl: `supertoss://send?bank=국민은행&accountNo=64021-0172-719&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
  {
    name: "최정미",
    bank: "농협",
    accountNumber: "755018-51-114723",
    tossUrl: `supertoss://send?bank=농협&accountNo=755018-51-114723&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
];

// 신부측 계좌 정보 (사용하지 않음)
// const brideAccount = {
//   name: "신부측",
//   bank: "농협",
//   accountNumber: "123412341234",
// };

const Account = () => {
  const [expandedGroomSection, setExpandedGroomSection] = useState(true);
  // 신부측 계좌번호가 없으므로 숨김
  // const [expandedBrideSection, setExpandedBrideSection] = useState(false);

  // 복사 기능
  const copyToClipboard = async (text, name) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${name}님 계좌번호가 복사되었습니다`, {
        style: {
          background: "#333",
          color: "#fff",
        },
        duration: 2000,
      });
    } catch (err) {
      console.error("복사 실패:", err);
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 송금 기능
  const handleTossPayment = (url) => {
    window.location.href = url;
  };

  const handleKakaoPayPayment = (url) => {
    window.location.href = url;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-5 ${notoSans.className} bg-[#fdf1f2] w-full`}
    >
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* 타이틀 */}
      <div className="animate-slide-up mb-8">
        <div
          className={`text-white bg-[#ee7685] font-bold px-6 py-2 rounded-full text-xl ${gamjaFlower.className}`}
        >
          마음 전하실 곳
        </div>
      </div>

      {/* 계좌 정보 컨테이너 */}
      <div className="w-full max-w-md">
        {/* 신랑측 계좌 섹션 */}
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden border border-[#ee7685]/20">
          {/* 섹션 헤더 - 클릭 시 확장/축소 */}
          <button
            className="w-full flex items-center justify-between p-4 text-left bg-[#ee7685]/5"
            onClick={() => setExpandedGroomSection(!expandedGroomSection)}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-10 bg-[#ee7685] rounded-full"></div>
              <div>
                <h3 className="text-[#ee7685] font-bold text-lg">신랑측 계좌번호</h3>
                <p className="text-gray-500 text-sm">{groomAccounts.length}개의 계좌</p>
              </div>
            </div>
            {expandedGroomSection ? (
              <ChevronUp className="text-gray-500" size={20} />
            ) : (
              <ChevronDown className="text-gray-500" size={20} />
            )}
          </button>

          {/* 확장된 내용 */}
          {expandedGroomSection && (
            <div className="p-4 border-t border-[#ee7685]/10">
              {groomAccounts.map((account, index) => (
                <div
                  key={index}
                  className={`${index > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{account.name}</div>
                    <div className="text-sm text-gray-500">{account.bank}</div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-3">
                    <span className="text-gray-800 font-medium tracking-wide">
                      {account.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber, account.name)}
                      className="bg-white hover:bg-gray-100 text-[#ee7685] p-2 rounded-lg border border-[#ee7685]/30 flex items-center justify-center transition-colors"
                      aria-label="계좌번호 복사"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  {/* 송금 버튼 영역 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTossPayment(account.tossUrl)}
                      className="flex-1 py-2 px-3 bg-[#3182F6] hover:bg-[#2272E6] text-white rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>토스로 송금</span>
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={() => handleKakaoPayPayment(account.kakaoPayUrl)}
                      className="flex-1 py-2 px-3 bg-[#FFEB00] hover:bg-[#FFDD00] text-[#3C1E1E] rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>카카오페이</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 신부측 계좌 섹션 (지금은 숨김) */}
        {/* brideAccount && (
          <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden border border-[#ee7685]/20">
            ...
          </div>
        ) */}

        {/* 안내문구 */}
        <div className="text-center text-gray-500 text-sm mt-8 bg-white p-4 rounded-lg">
          <p>정성어린 축하의 마음 감사합니다.</p>
          <p className="mt-2 text-xs text-gray-400">
            계좌번호 옆 아이콘을 클릭하면 복사됩니다.
            <br />
            토스, 카카오페이 버튼으로 빠르게 송금하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;
