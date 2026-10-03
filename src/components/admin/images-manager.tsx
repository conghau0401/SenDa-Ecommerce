"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadImages } from "./upload";

export type ManagedImage = { id: string; url: string; alt: string };

function SortableImage({
  image,
  index,
  onRemove,
  onAlt,
}: {
  image: ManagedImage;
  index: number;
  onRemove: () => void;
  onAlt: (alt: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-surface ring-1 ring-border",
        isDragging && "z-10 shadow-lift ring-2 ring-leaf-500",
      )}
    >
      <div className="relative aspect-square bg-sand">
        <Image src={image.url} alt={image.alt} fill sizes="200px" className="object-cover" />
        {index === 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-leaf-700 px-2 py-0.5 text-[11px] font-semibold text-white">
            Ảnh chính
          </span>
        )}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 flex size-8 cursor-grab touch-none items-center justify-center rounded-lg bg-white/90 text-leaf-900 shadow active:cursor-grabbing"
          aria-label={`Kéo để sắp xếp ảnh ${index + 1}`}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-lg bg-white/90 text-red-600 opacity-0 shadow transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Xóa ảnh ${index + 1}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <input
        value={image.alt}
        onChange={(e) => onAlt(e.target.value)}
        placeholder="Mô tả ảnh (alt)"
        aria-label={`Mô tả ảnh ${index + 1}`}
        className="w-full border-t border-border px-2.5 py-1.5 text-xs outline-none focus:bg-leaf-50"
      />
    </li>
  );
}

/** Quản lý nhiều ảnh: upload nhiều file, kéo thả sắp xếp (chuột, cảm ứng, bàn phím), sửa alt, xóa */
export function ImagesManager({ images, onChange }: { images: ManagedImage[]; onChange: (imgs: ManagedImage[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleFiles = async (fileList: FileList | null) => {
    const files = [...(fileList ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadImages(files.slice(0, 10));
      onChange([...images, ...uploaded.map((u) => ({ id: crypto.randomUUID(), url: u.url, alt: "" }))]);
      toast.success(`Đã tải lên ${uploaded.length} ảnh`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const from = images.findIndex((i) => i.id === e.active.id);
    const to = images.findIndex((i) => i.id === e.over!.id);
    onChange(arrayMove(images, from, to));
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, i) => (
                <SortableImage
                  key={img.id}
                  image={img}
                  index={i}
                  onRemove={() => onChange(images.filter((x) => x.id !== img.id))}
                  onAlt={(alt) => onChange(images.map((x) => (x.id === img.id ? { ...x, alt } : x)))}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
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
        disabled={uploading}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-sm transition-colors",
          dragOver ? "border-leaf-500 bg-leaf-50 text-leaf-800" : "border-border text-muted hover:border-leaf-400 hover:text-leaf-700",
        )}
      >
        {uploading ? <Loader2 className="size-6 animate-spin" aria-hidden /> : <ImagePlus className="size-6" aria-hidden />}
        <span className="font-medium">{uploading ? "Đang tải ảnh..." : "Thêm ảnh"}</span>
        <span className="text-xs">Kéo thả nhiều ảnh vào đây hoặc bấm để chọn · JPG/PNG/WebP, tối đa 5MB/ảnh</span>
      </button>
      {images.length > 1 && <p className="text-xs text-muted">Kéo biểu tượng ⠿ để sắp xếp. Ảnh đầu tiên là ảnh chính.</p>}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
