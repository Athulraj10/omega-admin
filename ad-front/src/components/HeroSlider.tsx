"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface Banner {
  _id: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  offerText: string;
  offerHighlight: string;
  buttonText: string;
  device: 'desktop' | 'mobile';
  status: '1' | '0';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/banners/public');
        
        if (response.data?.meta?.code === 200 || response.data?.success) {
          // Filter active banners and sort by isDefault (default first)
          const activeBanners = response.data.data
            .filter((banner: Banner) => banner.status === '1')
            .sort((a: Banner, b: Banner) => {
              if (a.isDefault && !b.isDefault) return -1;
              if (!a.isDefault && b.isDefault) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
          
          setBanners(activeBanners);
        } else {
          setError('Failed to fetch banners');
        }
      } catch (err: any) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="section gi-hero m-tb-40">
        <div className="container">
          <div className="gi-main-content">
            <div className="gi-slider-content">
              <div className="gi-main-slider">
                <div className="flex items-center justify-center h-64">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="section gi-hero m-tb-40">
        <div className="container">
          <div className="gi-main-content">
            <div className="gi-slider-content">
              <div className="gi-main-slider">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">Unable to load banners</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show fallback if no banners
  if (banners.length === 0) {
    return <div className="text-center py-12 text-gray-400">No banners found.</div>;
  }

  return (
    <>
      <section className="section gi-hero m-tb-40">
        <div className="container">
          <div className="gi-main-content">
            <div className="gi-slider-content">
              <div className="gi-main-slider">
                <>
                  <Swiper
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    loop={true}
                    speed={2000}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    slidesPerView={1}
                    className="swiper-pagination-white gi-slider main-slider-nav main-slider-dot swiper-wrapper"
                  >
                    {banners.map((banner, index) => (
                      <SwiperSlide key={banner._id} className={`gi-slide-item swiper-slide d-flex slide-${index + 1}`}>
                        <div 
                          className="gi-slide-content slider-animation"
                          style={{
                            backgroundImage: `url(${banner.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            minHeight: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}
                        >
                          {/* Overlay for better text readability */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              zIndex: 1
                            }}
                          ></div>
                          
                          {/* Content */}
                          <div className="relative z-10 text-center text-white">
                            {banner.offerText && (
                              <p className="text-lg mb-2">
                                {banner.offerText} {banner.offerHighlight && <b>{banner.offerHighlight}</b>}
                              </p>
                            )}
                            
                            <h1 className="gi-slide-title text-4xl md:text-6xl font-bold mb-4">
                              {banner.titleLine1}
                            </h1>
                            
                            {banner.titleLine2 && (
                              <h2 className="text-xl md:text-2xl mb-4">
                                {banner.titleLine2}
                              </h2>
                            )}
                            
                            <div className="gi-slide-btn">
                              <Link href="/" className="gi-btn-1">
                                {banner.buttonText || "Shop Now"}{" "}
                                <i
                                  className="fi-rr-angle-double-small-right"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                    <div className=" swiper-pagination swiper-pagination-white"></div>
                    <div className="swiper-buttons">
                      <div className="swiper-button-next"></div>
                      <div className="swiper-button-prev"></div>
                    </div>
                  </Swiper>
                </>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSlider; 