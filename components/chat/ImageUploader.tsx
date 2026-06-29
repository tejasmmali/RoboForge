"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import type { MessageImage } from "@/types/message";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

type ImageUploaderProps = {
  images: MessageImage[];
  onChange: (images: MessageImage[]) => void;
  disabled?: boolean;
  showPreviews?: boolean;
  className?: string;
};

function generateImageId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ImageUploader({
  images,
  onChange,
  disabled,
  showPreviews = true,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || disabled) return;

    const next: MessageImage[] = [...images];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;

      const previewDataUrl = await readAsDataUrl(file);
      next.push({
        id: generateImageId(),
        url: previewDataUrl,
        name: file.name,
        mimeType: file.type,
        previewDataUrl,
      });
    }

    onChange(next.slice(0, 4));
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className={cn(showPreviews && "flex flex-col gap-2", className)}>
      {showPreviews && images.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative h-16 w-16 overflow-hidden rounded-[12px] border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewDataUrl ?? image.url}
                alt={image.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-background opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <motion.button
        type="button"
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        title="Upload circuit or wiring photo (vision analysis coming soon)"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
      >
        <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
      </motion.button>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
