// components/Guestbook.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "react-hot-toast";
import { RefreshCw, MessageSquare, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export default function Guestbook() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [deleteInfo, setDeleteInfo] = useState({ id: null, password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fetchMessages = async (page = 1) => {
    setIsLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from("guestbook")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("불러오기 실패");
    } else {
      setMessages(data || []);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    }
    setIsLoading(false);
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

    const { error } = await supabase.from("guestbook").insert([{ author, message, password }]);

    if (error) {
      toast.error("작성 실패");
    } else {
      toast.success("작성 완료!");
      setAuthor("");
      setMessage("");
      setPassword("");
      setIsOpen(false);
      fetchMessages(1);
      setPage(1);
    }
    setIsSubmitting(false);
  };

  const deleteMessage = async () => {
    if (!deleteInfo.id || !deleteInfo.password) return;
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
      setDeleteInfo({ id: null, password: "" });
      setIsDeleteDialogOpen(false);
      fetchMessages(page);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")} ${date.toTimeString().slice(0, 5)}`;
  };

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  return (
    <div className="px-2 py-10 max-w-md mx-auto w-full">
      <Toaster position="top-center" />

      <div className="text-center mb-6">
        <p className="uppercase text-xs text-gray-400 tracking-widest py-4">GUEST BOOK</p>
        <h2 className="text-base font-semibold">마음 전하는 곳</h2>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((item) => (
            <div
              key={item.id}
              className="relative w-full rounded-xl border border-gray-200 px-4 py-3 bg-white shadow-sm"
            >
              <button
                onClick={() => {
                  setDeleteInfo({ id: item.id, password: "" });
                  setIsDeleteDialogOpen(true);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="font-semibold text-gray-800 mb-1">{item.author}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.message}</p>
              <div className="text-xs text-gray-400 mt-2 text-right">
                {formatDate(item.created_at)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">방명록이 아직 없습니다.</p>
        )}

        {page < totalPages && (
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} className="w-full">
            더 보기
          </Button>
        )}

        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          작성하기
        </Button>
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
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">메시지</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ee7685] hover:bg-[#d35e6c]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" /> 저장 중...
                  </>
                ) : (
                  "메시지 저장"
                )}
              </Button>
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
          <Input
            type="password"
            placeholder="비밀번호"
            value={deleteInfo.password}
            onChange={(e) => setDeleteInfo({ ...deleteInfo, password: e.target.value })}
          />
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMessage} className="bg-red-500 hover:bg-red-600">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
