// src/components/ImageLightbox.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * ImageLightbox (portal)
 * props:
 *  - images: string[]
 *  - currentIndex: number
 *  - onClose: () => void
 *  - onNext: () => void (optional)
 *  - onPrev: () => void (optional)
 */
export default function ImageLightbox({ images = [], currentIndex = 0, onClose, onNext, onPrev }) {
  const [index, setIndex] = React.useState(currentIndex);

  useEffect(() => setIndex(currentIndex), [currentIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") setIndex(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex(i => (i + 1) % images.length);
    }
    document.addEventListener("keydown", onKey);

    // prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  // Ensure portal container exists
  const containerId = "lightbox-root";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  function handlePrev() {
    const prev = (index - 1 + images.length) % images.length;
    setIndex(prev);
    if (onPrev) onPrev();
  }
  function handleNext() {
    const next = (index + 1) % images.length;
    setIndex(next);
    if (onNext) onNext();
  }

  // click on backdrop closes only when clicking outside inner panel
  const content = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4"
        onMouseDown={(e) => {
          // close if click the backdrop (not inner panel)
          if (e.target === e.currentTarget) onClose?.();
        }}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.98, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.98, y: 10, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-5xl"
        >
          {/* Close */}
          <button
            aria-label="Close gallery"
            onClick={() => onClose?.()}
            className="absolute right-2 top-2 z-50 rounded-full bg-white p-2 shadow"
          >
            <X size={18} />
          </button>

          {/* Main image */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`Image ${index + 1}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="w-full max-h-[80vh] object-contain select-none bg-black"
              draggable={false}
            />

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setIndex(i)}
                  className={`h-14 w-20 rounded-md overflow-hidden border-2 ${i === index ? "ring-2 ring-sky-400" : "border-transparent"} shrink-0`}
                >
                  <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(content, container);
}
