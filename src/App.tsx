import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { ChevronRight, Menu, X, Instagram, Twitter, Youtube } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FerroCanvas from "./components/FerroCanvas";

/**
 * FERROFLOW - Apple-inspired Ferrofluid Display Website
 */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-20 h-12 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            <span className="text-white font-semibold text-sm tracking-tight">FERROFLOW</span>
          </a>
          <div className="hidden md:flex gap-8">
            <a href="#store" className="text-white/80 hover:text-white text-xs font-light transition-colors">Cửa hàng</a>
            <a href="#pro" className="text-white/80 hover:text-white text-xs font-light transition-colors">Dòng Pro</a>
            <a href="#kinetic" className="text-white/80 hover:text-white text-xs font-light transition-colors">Động học</a>
            <a href="#support" className="text-white/80 hover:text-white text-xs font-light transition-colors">Hỗ trợ</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex gap-6 items-center">
            <svg className="w-4 h-4 text-white/80 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <svg className="w-4 h-4 text-white/80 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
        >
          <a href="#" className="text-white text-xl font-medium">Cửa hàng</a>
          <a href="#" className="text-white text-xl font-medium">Dòng Pro</a>
          <a href="#" className="text-white text-xl font-medium">Động học</a>
          <a href="#" className="text-white text-xl font-medium">Hỗ trợ</a>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.2]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <section ref={scrollRef} className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-transparent">
        {/* Atmosphere Glow */}
        <motion.div 
          style={{ opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-10" 
        />
        
        <motion.div 
          style={{ opacity, scale, y: yBg }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200" 
            alt="Ferrofluid Hero" 
            className="w-full h-full object-cover opacity-60 filter brightness-90"
          />
        </motion.div>
        
        <motion.div style={{ y: yText }} className="relative z-20 text-center px-4 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-orange-500 text-sm font-semibold mb-3 tracking-widest uppercase"
          >
            Mới
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl font-semibold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
          >
            The Flux Pro.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-white/80 text-xl md:text-3xl font-light tracking-tight mb-10 max-w-2xl mx-auto leading-tight"
          >
            Từ trường. Bậc thầy chế tác bên trong lớp kính hàng không.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex gap-6 justify-center items-center"
          >
            <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-10 py-4 rounded-full text-base font-medium transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20">
              Mua ngay
            </button>
            <button className="text-[#2997ff] hover:underline flex items-center gap-1 text-base font-medium group">
              Tìm hiểu thêm <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Bar */}
      <div className="h-32 bg-[#1d1d1f] border-t border-white/5 flex items-center justify-around px-10 md:px-24 z-30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <p className="text-white font-semibold text-lg md:text-3xl tracking-tight">99.9%</p>
          <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-2 font-bold">Hạt Nano tinh khiết</p>
        </motion.div>
        <div className="h-12 w-px bg-white/10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center relative z-10"
        >
          <p className="text-white font-semibold text-lg md:text-3xl tracking-tight">Kính Lab</p>
          <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-2 font-bold">Borosilicate cấp cao</p>
        </motion.div>
        <div className="h-12 w-px bg-white/10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center relative z-10"
        >
          <p className="text-white font-semibold text-lg md:text-3xl tracking-tight">3200G</p>
          <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-2 font-bold">Sức mạnh Neodymium</p>
        </motion.div>
      </div>
    </>
  );
};

const FeatureSection = ({ title, subtitle, bgImage, dark = true, reverse = false }) => {
  return (
    <section className={`relative min-h-[90vh] flex items-center py-32 px-6 ${dark ? 'bg-black/40' : 'bg-[#f5f5f7]'}`}>
      <div className={`max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className={reverse ? 'md:order-2' : ''}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className={`text-5xl md:text-7xl font-semibold tracking-tighter mb-8 ${dark ? 'text-white' : 'text-black'}`}>
              {title}
            </h2>
            <p className={`text-xl md:text-2xl font-light tracking-tight leading-relaxed ${dark ? 'text-white/50' : 'text-black/60'}`}>
              {subtitle}
            </p>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className={`relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10 ${reverse ? 'md:order-1' : ''}`}
        >
          <img src={bgImage} alt={title} className="w-full h-full object-cover" />
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 1 }}
             className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" 
          />
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ name, price, description, image }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20, stiffness: 150 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div 
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-[#1d1d1f] rounded-[48px] p-10 flex flex-col h-full group border border-white/5 relative overflow-hidden transition-colors hover:border-white/10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex-1 mb-10 overflow-hidden rounded-[32px] relative shadow-2xl">
        <motion.img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]" />
      </div>
      <h3 className="text-white text-3xl font-semibold mb-3 tracking-tight group-hover:text-blue-400 transition-colors">{name}</h3>
      <p className="text-white/40 text-base font-light mb-8 flex-1 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-white text-xl font-medium tracking-tight">{price}</span>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-[#0071e3] text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#0077ed] transition-all shadow-lg"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="bg-black text-[#f5f5f7] selection:bg-blue-500/30 font-sans relative">
      <FerroCanvas />
      <Navbar />
      
      <main>
        <Hero />
        
        <FeatureSection 
          title="Ma thuật của từ trường."
          subtitle="Hàng triệu hạt nano từ tính lơ lửng trong một cấu trúc hình học tinh xảo, phản ứng với mọi chuyển động của bạn một cách mượt mà."
          bgImage="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80"
        />
        
        <FeatureSection 
          title="Chế tác thủ công."
          subtitle="Vỏ kính cường lực Borosilicate và đế gỗ óc chó nguyên khối được tiện thủ công tại xưởng nghệ thuật của chúng tôi bởi những nghệ nhân bậc thầy."
          bgImage="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80"
          reverse
        />

        <section id="store" className="py-32 px-6 max-w-[1240px] mx-auto bg-transparent relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter">Bộ sưu tập.</h2>
              <p className="text-white/40 mt-6 text-xl md:text-2xl font-light tracking-tight max-w-xl">Tìm phiên bản phù hợp với không gian sáng tạo của bạn.</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProductCard 
              name="Prisma Slate"
              price="4.500.000₫"
              description="Khối kính đa diện tối giản với ferrofluid đen tuyền tinh khiết, mang lại vẻ đẹp tĩnh lặng."
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
            />
            <ProductCard 
              name="Orbital Walnut"
              price="6.200.000₫"
              description="Thiết kế hình cầu lơ lửng trên đế gỗ óc chó cao cấp tích hợp nam châm neodymium siêu mạnh."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
            />
            <ProductCard 
              name="Core Ultra"
              price="12.000.000₫"
              description="Phiên bản giới hạn với khả năng tương tác qua âm thanh sống động và ứng dụng di động độc quyền."
              image="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800"
            />
          </div>
        </section>

        <section className="py-40 bg-[#1d1d1f] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,113,227,0.05),transparent)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-semibold mb-12 tracking-tight leading-tight"
            >
              Trải nghiệm tương tác không giới hạn.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xl md:text-3xl text-white/50 font-light tracking-tight leading-relaxed mb-20"
            >
              Chúng tôi không chỉ bán một món đồ trang trí. Chúng tôi mang đến một thực thể sống động, 
              một cuộc đối thoại kỳ thú giữa vật lý và nghệ thuật ngay trên bàn làm việc của bạn.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="inline-flex flex-col items-center gap-6 group cursor-pointer"
            >
              <span className="text-zinc-500 uppercase tracking-[0.3em] text-[11px] font-bold group-hover:text-white transition-colors duration-500">Khám phá video</span>
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-700 shadow-[0_0_40px_rgba(0,113,227,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent transition-opacity group-hover:opacity-100 opacity-0" />
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2 relative z-10" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-black py-40 px-6 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 text-[14px]">
          <div>
            <div className="flex items-center gap-2 mb-10 group cursor-pointer">
              <svg className="w-5 h-5 fill-white transition-transform group-hover:rotate-12" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              <h3 className="text-white text-lg font-semibold tracking-tight">FERROFLOW</h3>
            </div>
            <p className="text-white/40 leading-relaxed max-w-xs text-base font-light">
              Dẫn đầu toàn cầu trong việc kết hợp khoa học vật liệu nano và nghệ thuật đương đại kỳ ảo.
            </p>
            <div className="flex gap-8 mt-12">
              <Instagram className="text-white/40 hover:text-white cursor-pointer transition-all hover:scale-110" size={20} />
              <Twitter className="text-white/40 hover:text-white cursor-pointer transition-all hover:scale-110" size={20} />
              <Youtube className="text-white/40 hover:text-white cursor-pointer transition-all hover:scale-110" size={20} />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-10 text-base">Sản phẩm</h4>
            <ul className="flex flex-col gap-5 text-white/40 font-light">
              <li className="hover:text-white cursor-pointer transition-colors">Prisma Series</li>
              <li className="hover:text-white cursor-pointer transition-colors">Orbital Series</li>
              <li className="hover:text-white cursor-pointer transition-colors">Limited Editions</li>
              <li className="hover:text-white cursor-pointer transition-colors">Phụ kiện & Quà tặng</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-10 text-base">Hỗ trợ</h4>
            <ul className="flex flex-col gap-5 text-white/40 font-light">
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo hành</li>
              <li className="hover:text-white cursor-pointer transition-colors">Theo dõi đơn hàng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hướng dẫn bảo quản</li>
              <li className="hover:text-white cursor-pointer transition-colors">Dịch vụ doanh nghiệp</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-10 text-base">Liên hệ</h4>
            <ul className="flex flex-col gap-5 text-white/40 font-light">
              <li className="hover:text-white cursor-pointer underline decoration-white/10 underline-offset-8 transition-colors hover:decoration-white">Showroom Hà Nội</li>
              <li className="hover:text-white cursor-pointer underline decoration-white/10 underline-offset-8 transition-colors hover:decoration-white">Showroom TP.HCM</li>
              <li className="hover:text-white cursor-pointer transition-colors">hello@ferroflow.vn</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hotline: 1900 88XX</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1240px] mx-auto mt-40 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-10 text-[12px] text-white/20">
          <div className="flex flex-col md:flex-row gap-12">
            <p>© 2026 FerroFlow Inc. Việt Nam. Mọi quyền được bảo lưu.</p>
            <div className="flex gap-10 font-light">
              <span className="hover:text-white cursor-pointer transition-colors">Bảo mật</span>
              <span className="hover:text-white cursor-pointer transition-colors">Điều khoản</span>
              <span className="hover:text-white cursor-pointer transition-colors">Pháp lý</span>
            </div>
          </div>
          <p className="font-medium tracking-widest uppercase text-[10px]">Việt Nam</p>
        </div>
      </footer>
    </div>
  );
}
