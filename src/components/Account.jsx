"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

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

const brideAccounts = [
  {
    name: "고상두",
    bank: "우리은행",
    accountNumber: "126-070458-12-501",
    tossUrl: `supertoss://send?bank=우리은행&accountNo=126-070458-12-501&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
  {
    name: "고유미",
    bank: "우리은행",
    accountNumber: "1002-343-314255",
    tossUrl: `supertoss://send?bank=우리은행&accountNo=1002-343-314255&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
];

const Account = () => {
  const [expandedGroomSection, setExpandedGroomSection] = useState(true);
  const [expandedBrideSection, setExpandedBrideSection] = useState(true);

  const copyToClipboard = async (text, name) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${name}님의 계좌번호가 복사되었습니다`, {
        style: { background: "#333", color: "#fff" },
        duration: 2000,
      });
    } catch {
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const renderAccountBox = (title, accounts, expanded, setExpanded) => (
    <div className="bg-white border mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-3 border-b"
        onClick={() => setExpanded(!expanded)}
      >
        <strong className="text-sm font-bold text-gray-800">{title}</strong>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expanded && (
        <div className="divide-y">
          {accounts.map((account, i) => (
            <div key={i} className="px-4 py-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {i === 0
                    ? title.includes("신랑")
                      ? "신랑"
                      : "신부"
                    : title.includes("신랑")
                    ? "아버지"
                    : "어머니"}
                </span>
                <span className="text-sm font-medium text-gray-900">{account.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{account.bank}</span>
                <span className="text-sm font-medium text-gray-900">{account.accountNumber}</span>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => copyToClipboard(account.accountNumber, account.name)}
                  className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded hover:bg-gray-200"
                >
                  복사하기
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <a
                  href={account.tossUrl}
                  className="flex-1 py-2 px-3 bg-[#3182F6] hover:bg-[#2272E6] text-white rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <span>토스로 송금</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href={account.kakaoPayUrl}
                  className="flex-1 py-2 px-3 bg-[#FFEB00] hover:bg-[#FFDD00] text-[#3C1E1E] rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <span>카카오페이</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 py-10 text-center">
      <Toaster position="top-center" />
      <div className="text-center mb-6">
        <p className="uppercase text-xs text-gray-400 tracking-widest py-4">THANKS TO</p>
        <h2 className="text-base font-semibold">마음 전하는 곳</h2>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        직접 축하를 전하지 못하는 분들을 위해 <br />
        부득이하게 계좌번호를 기재하게 되었습니다.
        <br />
        넓은 마음으로 양해 부탁드립니다.
      </p>

      {renderAccountBox(
        "신랑 측 계좌번호",
        groomAccounts,
        expandedGroomSection,
        setExpandedGroomSection
      )}
      {renderAccountBox(
        "신부 측 계좌번호",
        brideAccounts,
        expandedBrideSection,
        setExpandedBrideSection
      )}
    </div>
  );
};

export default Account;
