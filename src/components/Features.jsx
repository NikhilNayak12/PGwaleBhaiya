import React from "react";
import { ShieldCheck, Search, Zap, Heart, Gift, Tag } from "lucide-react";

const items = [
  { title: "Verified Listings", text: "All PGs are personally verified by our team.", Icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
  { title: "Smart Search", text: "Find exactly what you need with filters.", Icon: Search, color: "bg-sky-50 text-sky-600" },
  { title: "Quick Booking", text: "Book your ideal PG in minutes.", Icon: Zap, color: "bg-amber-50 text-amber-600" },
  { title: "Student-Friendly", text: "Flexible terms and support for students.", Icon: Heart, color: "bg-pink-50 text-pink-600" },
  { title: "Cashback Rewards", text: "Get guranteed cashback on successful bookings.", Icon: Gift, color: "bg-violet-50 text-violet-600" },
  { title: "Best Prices", text: "Transparent pricing and no hidden charges.", Icon: Tag, color: "bg-lime-50 text-lime-600" },
];

export default function Features() {
  return (
    <section className="mt-12">
      <div className="text-center">
        <h3 className="text-3xl md:text-4xl font-heading font-extrabold">Why Choose PG wale Bhaiya?</h3>
        <p className="mt-2 text-slate-500 max-w-2xl mx-auto">We're your trusted partner in finding the perfect home away from home near LPU.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {items.map(({ title, text, Icon, color }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 md:p-8 card-floating hover:translate-y-1 transition-transform duration-250"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} mb-4 shadow-sm`}>
              <Icon size={20} />
            </div>

            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
