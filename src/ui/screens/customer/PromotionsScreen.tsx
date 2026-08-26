import React, { useState, useEffect } from 'react';
import { Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Promotion } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { CustomerBottomNav } from '../../components/BottomNav';

export const PromotionsScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/promotions');
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading special offers..." fullScreen />
        <CustomerBottomNav active="Promotions" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            SPECIAL OFFERS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Promotions
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Little luxuries, special moments and exclusive seasonal privileges.
          </p>
        </div>

        {/* Promotions List */}
        <div className="space-y-5">
          {promotions.map((promo) => (
            <div
              key={promo.id || promo._id}
              className="bg-[#3A241C] text-[#FFFDFC] rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(58,36,28,0.22)] border border-[#3A241C]"
            >
              <div className="h-40 relative overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A241C] via-[#3A241C]/40 to-transparent" />
                {promo.badge && (
                  <span className="absolute top-3 left-3 bg-[#C9A66B] text-[#241611] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {promo.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[#C9A66B] mb-2">
                  <Tag size={18} />
                  <span className="text-xs font-extrabold uppercase tracking-widest">
                    Promo Code: <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{promo.code || 'AURELIA'}</strong>
                  </span>
                </div>

                <h3 className="font-serif-luxury font-bold text-xl text-[#FFFDFC] mb-2">
                  {promo.title}
                </h3>

                <p className="text-xs text-[#EFE5D8] leading-relaxed mb-4">
                  {promo.description}
                </p>

                <div className="bg-white/10 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#E4D1AD] uppercase font-bold tracking-wider block">
                      PRIVILEGE
                    </span>
                    <span className="text-base font-extrabold text-[#E4D1AD]">
                      {promo.discount}
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-[#EFE5D8]">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar size={12} className="text-[#C9A66B]" />
                      <span>Valid until {promo.end_date}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('Services', { category: promo.category || 'All' })}
                  className="w-full h-12 bg-[#6B4A3A] hover:bg-[#C9A66B] hover:text-[#241611] text-[#FFFDFC] text-xs font-extrabold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>VIEW QUALIFYING SERVICES</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {promotions.length === 0 && (
            <EmptyState
              icon={<Sparkles size={28} />}
              title="No Active Promotions"
              text="Check back soon for seasonal packages and exclusive member rewards."
            />
          )}
        </div>

      </div>

      <CustomerBottomNav active="Promotions" />
    </div>
  );
};
