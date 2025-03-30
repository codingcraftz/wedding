// components/Guestbook.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "react-hot-toast";
import { RefreshCw, MessageSquare, Trash2 } from "lucide-react";
import { Noto_Sans_KR } from "next/font/google";

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
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

const notoSans = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"] });

export default function Guestbook() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [deleteInfo, setDeleteInfo] = useState({ id: null, password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("불러오기 실패");
    else setMessages(data || []);
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
      fetchMessages();
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
      fetchMessages();
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className={`px-4 py-10 ${notoSans.className}`}>
      <Toaster position="top-center" />

      <div className="mb-6 text-center">
        <div className="text-white bg-[#ee7685] inline-block font-bold px-6 py-2 rounded-full text-xl">
          축하의 한마디
        </div>
      </div>

      <div className="max-w-md mx-auto mb-4 text-right">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ee7685] hover:bg-[#d35e6c]">
              <MessageSquare className="mr-2 h-4 w-4" /> 글 남기기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-[450px]">
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
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="h-6 w-6 animate-spin text-[#ee7685]" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex justify-between bg-[#ee7685]/10 px-4 py-3">
                <CardTitle className="text-base">{item.author}</CardTitle>
                <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
              </CardHeader>
              <CardContent className="px-4 py-2">
                <p className="whitespace-pre-wrap text-gray-800">{item.message}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-2 flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => setDeleteInfo({ ...deleteInfo, id: item.id })}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> 삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw]">
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
                      <AlertDialogAction
                        onClick={deleteMessage}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        삭제하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">방명록이 아직 없습니다.</div>
        )}

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={fetchMessages} className="text-gray-500">
            <RefreshCw className="mr-2 h-4 w-4" /> 새로고침
          </Button>
        </div>
      </div>
    </div>
  );
}
