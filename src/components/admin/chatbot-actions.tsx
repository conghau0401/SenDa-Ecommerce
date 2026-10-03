"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteConversation } from "@/actions/admin/chatbot";
import { buttonClass } from "../ui/button";
import { ConfirmButton } from "./confirm-button";

export function DeleteConversationButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <ConfirmButton
      title="Xóa hội thoại này?"
      description="Toàn bộ tin nhắn của hội thoại sẽ bị xóa vĩnh viễn."
      action={() => deleteConversation(id)}
      onDone={() => router.push("/admin/chatbot")}
      className={buttonClass({ variant: "outline", size: "sm", className: "border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50" })}
    >
      <Trash2 className="size-4" aria-hidden /> Xóa hội thoại
    </ConfirmButton>
  );
}
