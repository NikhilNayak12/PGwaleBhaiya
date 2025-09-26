import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useTestimonials } from "../hooks/useTestimonials";

export default function Testimonials() {
  const { testimonials, stats, loading } = useTestimonials();
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const item = testimonials[index] || {};

  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    setIsExpanded(false);
  }
  
  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
    setIsExpanded(false);
  }

  if (loading) {
    return (
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-96 bg-gray-300 rounded-2xl animate-pulse"></div>
            <div className="bg-gray-200 rounded-2xl p-8 h-96 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold">What Students Say About Us</h3>
          <p className="mt-2 text-slate-500">
            Real experiences from real students who found their perfect stay through PG wale Bhaiya
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Image + Stats */}
          <div className="relative">
            <img
              src="/students.png"
              alt="students"
              className="w-full rounded-2xl object-cover shadow-lg h-[380px]"
            />

            {/* Stats pill */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 transform bg-white/95 backdrop-blur-md rounded-xl shadow-md px-6 py-4 flex items-center gap-8 w-[85%] md:w-[70%] justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{stats.happyStudents.toLocaleString()}+</div>
                <div className="text-xs text-slate-500">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{stats.satisfactionRate}%</div>
                <div className="text-xs text-slate-500">Satisfied</div>
              </div>
            </div>
          </div>

          {/* Right: Testimonial Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(14,30,37,0.08)] p-8 md:p-10 min-h-[380px] flex flex-col justify-between transition-all duration-300 ease-in-out">
              {/* quote icon + stars */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div className="flex-1">
                  <blockquote 
                    className={`text-slate-700 text-lg md:text-xl leading-relaxed flex-1 cursor-pointer transition-all duration-300 ${
                      isExpanded ? '' : 'line-clamp-4'
                    }`}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    "{item.quote}"
                  </blockquote>
                  
                  {/* Show expand/collapse hint */}
                  {!isExpanded && item.quote.length > 200 && (
                    <button 
                      onClick={() => setIsExpanded(true)}
                      className="text-sky-600 text-sm hover:text-sky-700 mt-1"
                    >
                      Read more...
                    </button>
                  )}
                  {isExpanded && (
                    <button 
                      onClick={() => setIsExpanded(false)}
                      className="text-sky-600 text-sm hover:text-sky-700 mt-1"
                    >
                      Show less
                    </button>
                  )}

                  <hr className="my-6 border-slate-100" />

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="text-sm text-slate-500">{item.role}</div>
                      <a href="#" className="text-sm text-sky-600 mt-1 inline-block">
                        {item.stay}
                      </a>
                      {/* Dots moved here */}
                      <div className="flex items-center gap-2 mt-3">
                        {testimonials.map((t, i) => (
                          <button
                            key={t.id}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to testimonial ${i + 1}`}
                            className={`w-3 h-3 rounded-full transition-all ${
                              i === index ? "bg-sky-600 scale-110" : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Prev/Next buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prev}
                        aria-label="Previous testimonial"
                        className="p-2 rounded-md border hover:bg-slate-50"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={next}
                        aria-label="Next testimonial"
                        className="p-2 rounded-md border hover:bg-slate-50"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
