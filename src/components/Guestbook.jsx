// components/guestbook.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "react-hot-toast";
import { RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 애니메이션 변형(variants) 정의
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
      ease: "easeOut",
    },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgb(55, 65, 81)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.97 },
};

export default function Guestbook() {
  const [isOpen, setIsOpen] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [deleteInfo, setDeleteInfo] = useState({ id: null, password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3; // 페이지당 3개의 메시지 표시

  // 스크롤 애니메이션을 위한 IntersectionObserver 설정
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "5% 0px",
  });

  const fetchAllMessages = async () => {
    setIsLoading(true);
    // 모든 메시지를 한 번에 가져옴
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("불러오기 실패");
    } else {
      setAllMessages(data || []);
      // 총 페이지 수 계산
      setTotalPages(Math.ceil((data?.length || 0) / pageSize));
      // 첫 페이지 데이터 설정
      updateDisplayMessages(1, data || []);
    }
    setIsLoading(false);
  };

  // 현재 페이지에 표시할 메시지 업데이트
  const updateDisplayMessages = (currentPage, messages = allMessages) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayMessages(messages.slice(startIndex, endIndex));
  };

  const saveMessage = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!author.trim() || !message.trim() || password.length < 4) {
      toast.error("모든 항목을 채워주세요 (비밀번호 4자 이상)");
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from("guestbook")
      .insert([{ author, message, password }])
      .select();

    if (error) {
      toast.error("작성 실패");
    } else {
      toast.success("작성 완료!");
      setAuthor("");
      setMessage("");
      setPassword("");
      setIsOpen(false);

      // 새 메시지를 포함하여 모든 메시지를 다시 가져옴
      fetchAllMessages();
      setPage(1);
    }
    setIsSubmitting(false);
  };

  const deleteMessage = async () => {
    if (!deleteInfo.id || !deleteInfo.password) return;

    // 관리자 비밀번호 체크
    if (deleteInfo.password === "baduk") {
      const { error } = await supabase.from("guestbook").delete().eq("id", deleteInfo.id);
      if (error) toast.error("삭제 실패");
      else {
        toast.success("삭제 완료");
        handleDeleteSuccess();
      }
      return;
    }

    // 일반 사용자 비밀번호 체크
    const { data, error: fetchError } = await supabase
      .from("guestbook")
      .select("password")
      .eq("id", deleteInfo.id)
      .single();

    if (fetchError || !data) return toast.error("삭제 실패");
    if (data.password !== deleteInfo.password) {
      toast.error("비밀번호 불일치");
      return;
    }

    const { error } = await supabase.from("guestbook").delete().eq("id", deleteInfo.id);
    if (error) toast.error("삭제 실패");
    else {
      toast.success("삭제 완료");
      handleDeleteSuccess();
    }
  };

  // 삭제 성공 후 처리를 위한 헬퍼 함수
  const handleDeleteSuccess = () => {
    setDeleteInfo({ id: null, password: "" });
    setIsDeleteDialogOpen(false);

    // 삭제 후 메시지 목록 갱신
    const updatedMessages = allMessages.filter((item) => item.id !== deleteInfo.id);
    setAllMessages(updatedMessages);
    setTotalPages(Math.ceil(updatedMessages.length / pageSize));

    // 현재 페이지에 표시되는 항목이 없으면 페이지 번호 조정
    const currentPageItemCount = updatedMessages.slice(
      (page - 1) * pageSize,
      page * pageSize
    ).length;
    if (currentPageItemCount === 0 && page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      updateDisplayMessages(newPage, updatedMessages);
    } else {
      updateDisplayMessages(page, updatedMessages);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")} ${date.toTimeString().slice(0, 5)}`;
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      updateDisplayMessages(newPage);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 모든 데이터 가져오기
    fetchAllMessages();
  }, []);

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    // 총 페이지가 1페이지 이하면 페이지네이션 표시 안 함
    if (totalPages <= 1) return null;

    // 화면에 표시할 페이지 번호의 범위를 계산
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    // 페이지 범위 조정 (최소 3개의 페이지 버튼 표시)
    if (endPage - startPage + 1 < 3) {
      startPage = Math.max(1, endPage - 2);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center items-center gap-2 mt-6"
      >
        <motion.button
          whileHover={{ opacity: page === 1 ? 0.3 : 0.8 }}
          whileTap={page !== 1 ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            page === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {pageNumbers.map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(num)}
            className={`w-8 h-8 rounded-md ${
              page === num ? "bg-[#ee7685] text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {num}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ opacity: page === totalPages ? 0.3 : 0.8 }}
          whileTap={page !== totalPages ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            page === totalPages ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="px-4 py-10 max-w-md mx-auto w-full"
    >
      <Toaster position="top-center" />
      <motion.div variants={titleVariants} className="text-center mb-6">
        <motion.p
          variants={titleVariants}
          className="uppercase text-xs text-gray-400 tracking-widest py-4"
        >
          GUEST BOOK
        </motion.p>
        <motion.h2 variants={titleVariants} className="text-base font-semibold">
          따뜻한 마음으로 축복해 주세요
        </motion.h2>
      </motion.div>

      <div className="space-y-4">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center py-10"
          >
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </motion.div>
        ) : displayMessages.length > 0 ? (
          <AnimatePresence>
            {displayMessages.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                className="relative w-full rounded-2xl border border-gray-100 px-4 py-4 bg-white shadow-sm"
              >
                <motion.button
                  whileHover={{ color: "#f56565", scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDeleteInfo({ id: item.id, password: "" });
                    setIsDeleteDialogOpen(true);
                  }}
                  className="absolute right-3 top-3 text-gray-300 hover:text-red-400"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <p className="font-bold text-sm text-gray-900 mb-2">{item.author}</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {item.message}
                </p>
                <div className="text-xs text-gray-400 mt-3 text-right">
                  {formatDate(item.created_at)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.p variants={titleVariants} className="text-center text-gray-500 py-10">
            방명록이 아직 없습니다.
          </motion.p>
        )}

        {renderPagination()}

        <motion.div variants={buttonVariants} className="flex justify-center mt-8">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className="w-48 text-sm bg-gray-800 text-white hover:bg-gray-700 py-2 rounded-md"
          >
            작성하기
          </motion.button>
        </motion.div>
      </div>

      {/* 작성 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[450px] bg-white px-4">
          <DialogHeader>
            <DialogTitle>축하 메시지 작성</DialogTitle>
            <DialogDescription>신랑신부에게 축하 메시지를 남겨주세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveMessage} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="border px-3 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message">메시지</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border px-3 py-2 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border px-3 py-2 rounded-md"
              />
            </div>
            <DialogFooter className="pt-2">
              <motion.button
                whileHover={{ backgroundColor: "#d35e6c" }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ee7685] hover:bg-[#d35e6c] text-white py-2 rounded-md"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin inline-block mr-2" /> 저장 중...
                  </>
                ) : (
                  "메시지 저장"
                )}
              </motion.button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>메시지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              해당 메시지를 삭제하려면 비밀번호를 입력해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="password"
            placeholder="비밀번호"
            value={deleteInfo.password}
            onChange={(e) => setDeleteInfo({ ...deleteInfo, password: e.target.value })}
            className="w-full border mt-2 px-3 py-2 rounded-md"
          />
          <AlertDialogFooter className="pt-4 flex gap-2">
            <AlertDialogCancel className="flex-1 py-2 rounded-md border">취소</AlertDialogCancel>
            <motion.button
              whileHover={{ backgroundColor: "#E53E3E" }}
              whileTap={{ scale: 0.97 }}
              onClick={deleteMessage}
              className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              삭제하기
            </motion.button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
