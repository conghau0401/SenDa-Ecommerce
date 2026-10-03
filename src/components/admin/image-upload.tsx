"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadImages } from "./upload";

/** Upload 1 ảnh (ảnh đại diện, logo, banner...) – hỗ trợ kéo thả file */
export function ImageUpload({
  value,
  onChange,
  label = "Tải ảnh lên",
  aspect = "aspect-[4/3]",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const [img] = await uploadImages([file]);
      onChange(img.url);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border-2 border-dashed bg-sand/40 transition-colors",
          aspect,
          dragOver ? "border-leaf-500 bg-leaf-50" : "border-border",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="400px" className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-leaf-900 hover:bg-leaf-50"
              >
                Đổi ảnh
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex size-8 items-center justify-center rounded-lg bg-white text-red-600 hover:bg-red-50"
                aria-label="Xóa ảnh"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-sm text-muted hover:text-leaf-700"
          >
            <ImagePlus className="size-7" aria-hidden />
            <span className="font-medium">{label}</span>
            <span className="text-xs">Kéo thả hoặc bấm để chọn (tối đa 5MB)</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="size-6 animate-spin text-leaf-700" aria-label="Đang tải ảnh" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
