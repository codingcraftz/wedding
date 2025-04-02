"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const groomAccounts = [
  {
    name: "손승호",
    bank: "우리은행",
    accountNumber: "1002954989821",
    tossUrl: `supertoss://send?bank=우리은행&accountNo=1002954989821&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
  {
    name: "손삼익",
    bank: "국민은행",
    accountNumber: "640-21-0172-719",
    tossUrl: `supertoss://send?bank=국민은행&accountNo=64021-0172-719&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
  {
    name: "최정미",
    bank: "농협은행",
    accountNumber: "755018-51-114723",
    tossUrl: `supertoss://send?bank=농협&accountNo=755018-51-114723&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
];

const brideAccounts = [
  {
    name: "고유미",
    bank: "우리은행",
    accountNumber: "1002-343-314255",
    tossUrl: `supertoss://send?bank=우리은행&accountNo=1002-343-314255&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
  {
    name: "고상두",
    bank: "우리은행",
    accountNumber: "126-070458-12-501",
    tossUrl: `supertoss://send?bank=우리은행&accountNo=126-070458-12-501&origin=청첩장`,
    kakaoPayUrl: `https://qr.kakaopay.com/Ej9QfqGLl`,
  },
];

// 애니메이션 변형(variants) 정의
const containerVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const titleVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const accountBoxVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const accountItemVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

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

  // 관계 표시 함수
  const getRelationship = (index, isBride) => {
    if (index === 0) {
      return isBride ? "신부" : "신랑";
    } else if (index === 1) {
      return "아버지";
    } else {
      return "어머니";
    }
  };

  const renderAccountBox = (title, accounts, expanded, setExpanded) => (
    <motion.div variants={accountBoxVariants} className="bg-white border mt-4">
      <motion.button
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center px-4 py-3 border-b relative"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-sm font-semibold text-gray-800 ">{title}</p>
        <div className="absolute right-4">
          <motion.div
            initial={false}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </motion.button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-y overflow-hidden"
          >
            {accounts.map((account, i) => (
              <motion.div
                key={i}
                variants={accountItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.1 }}
                className="px-4 py-3 flex flex-col gap-2"
              >
                <div className="grid grid-cols-[4em_1fr] items-center">
                  <span className="text-sm text-gray-500 text-left">
                    {getRelationship(i, title.includes("신부"))}
                  </span>
                  <span className="text-sm font-medium text-gray-900 text-left">
                    {account.name}
                  </span>
                </div>
                <div className="grid grid-cols-[4em_1fr] items-center">
                  <span className="text-sm text-gray-500 text-left"></span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {account.bank} {account.accountNumber}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(229, 231, 235)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => copyToClipboard(account.accountNumber, account.name)}
                      className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full hover:bg-gray-200 flex items-center gap-1 ml-2 whitespace-nowrap"
                    >
                      <Copy size={12} />
                      <span>복사</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="visible"
      animate="visible"
      className="w-full mx-auto px-4 text-center pb-12"
    >
      <Toaster position="top-center" />
      <motion.div variants={titleVariants} className="text-center mb-6">
        <motion.p
          variants={titleVariants}
          className="uppercase text-xs text-gray-400 tracking-widest py-4"
        >
          THANKS TO
        </motion.p>
        <motion.h2 variants={titleVariants} className="text-base font-semibold">
          마음 전하는 곳
        </motion.h2>
      </motion.div>
      <motion.p variants={titleVariants} className="text-sm text-gray-700 leading-relaxed pb-4">
        직접 축하를 전하지 못하는 분들을 위해 <br />
        부득이하게 계좌번호를 기재하게 되었습니다.
        <br />
        넓은 마음으로 양해 부탁드립니다.
      </motion.p>

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
    </motion.div>
  );
};

export default Account;
