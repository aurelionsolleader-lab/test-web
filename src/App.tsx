import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { ChevronRight, Menu, X, Instagram, Twitter, Youtube, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FerroSpace from "./components/FerroSpace";
import FerroCanvas from "./components/FerroCanvas";

/**
 * FERROFLOW - Apple-inspired Ferrofluid Display Website
 */

const Navbar = ({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? (theme === 'dark' ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-white/80 backdrop-blur-xl border-b border-black/10') : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-20 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2">
            <svg className={`w-4 h-4 ${theme === 'dark' ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            <span className={`font-semibold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>FERROFLOW</span>
          </a>
          <div className="hidden md:flex gap-8">
            <a href="#store" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-black/60 hover:text-black'}`}>Cửa hàng</a>
            <a href="#kinetic" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-black/60 hover:text-black'}`}>Động học</a>
            <a href="#support" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-black/60 hover:text-black'}`}>Hỗ trợ</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
          >
            {theme === 'dark' ? <Sun size={14} className="text-white" /> : <Moon size={14} className="text-black" />}
          </button>
          <button className={`md:hidden ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-16 left-0 w-full p-6 flex flex-col gap-4 md:hidden border-b ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
        >
          <a href="#store" className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Cửa hàng</a>
          <a href="#kinetic" className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Động học</a>
          <a href="#support" className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Hỗ trợ</a>
        </motion.div>
      )}
    </nav>
  );
};

const KineticSection = ({ theme }: { theme: 'dark' | 'light' }) => {
  return (
    <div className={`w-full h-[600px] rounded-[48px] overflow-hidden border relative group cursor-crosshair shadow-2xl transition-colors ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
      <FerroSpace activeSection={0} theme={theme} />
      <div className="absolute top-8 left-8 pointer-events-none">
        <p className={`${theme === 'dark' ? 'text-white/40' : 'text-black/40'} text-[10px] uppercase tracking-widest font-bold mb-2`}>3D Ferrofluid Simulation</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <p className={`${theme === 'dark' ? 'text-white/10' : 'text-black/10'} text-[9px] uppercase tracking-[1em] font-bold`}>Vật lý nano 3D</p>
      </div>
    </div>
  );
};

const Hero = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);

  return (
    <section ref={scrollRef} className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      <motion.div 
        style={{ opacity, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000" 
          alt="Ferrofluid Hero" 
          className="w-full h-full object-cover opacity-60 filter brightness-90"
        />
      </motion.div>
      
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-blue-500 text-sm font-semibold mb-3 tracking-widest uppercase"
        >
          Trải nghiệm mới
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-6xl md:text-9xl font-semibold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
        >
          The Flux Pro.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/80 text-xl md:text-3xl font-light tracking-tight mb-10 max-w-2xl mx-auto leading-tight"
        >
          Cấu trúc nano. Vũ điệu của từ trường trong không gian 3D.
        </motion.p>
        <div className="flex gap-6 justify-center items-center">
          <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-10 py-4 rounded-full text-base font-medium transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20">
            Mua ngay
          </button>
          <button className="text-[#2997ff] hover:underline flex items-center gap-1 text-base font-medium group">
            Tìm hiểu thêm <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = ({ title, subtitle, bgImage, dark = true, reverse = false }: { title: string, subtitle: string, bgImage: string, dark?: boolean, reverse?: boolean }) => {
  return (
    <section className={`relative min-h-screen flex items-center py-32 px-6 ${dark ? 'bg-black/40 text-white' : 'bg-white/40 text-black'}`}>
      <div className={`max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className={reverse ? 'md:order-2' : ''}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-tight">
              {title}
            </h2>
            <p className="text-xl md:text-2xl font-light tracking-tight leading-relaxed opacity-60">
              {subtitle}
            </p>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className={`relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white/10 ${reverse ? 'md:order-1' : ''}`}
        >
          <img src={bgImage} alt={title} className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ name, price, description, image }: { name: string, price: string, description: string, image: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20 });

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  return (
    <motion.div 
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="bg-[#1d1d1f] rounded-[48px] p-10 flex flex-col h-full group border border-white/5 relative overflow-hidden"
    >
      <div className="flex-1 mb-10 overflow-hidden rounded-[32px] relative shadow-2xl">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      </div>
      <h3 className="text-white text-3xl font-semibold mb-3 tracking-tight">{name}</h3>
      <p className="text-white/40 text-base font-light mb-8 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-white text-xl font-medium">{price}</span>
        <button className="bg-[#0071e3] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#0077ed] transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <FerroCanvas theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <Hero />
        
        <div className="h-32 bg-[#1d1d1f] border-t border-white/5 flex items-center justify-around px-10 md:px-24">
          <div className="text-center">
            <p className="text-white font-semibold text-lg md:text-3xl">99.9%</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Hạt Nano</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg md:text-3xl">Glass 4K</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Độ trong suốt</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg md:text-3xl">3D Core</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Mô phỏng 3D</p>
          </div>
        </div>

        <section id="kinetic" className="py-32 px-6 max-w-[1240px] mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8">Động học.</h2>
            <p className="text-xl md:text-2xl font-light opacity-50 tracking-tight">
              Khám phá thực thể Ferrofluid trong không gian 3D. Tương tác và xoay để mọc gai theo ý muốn.
            </p>
          </div>
          <KineticSection theme={theme} />
        </section>

        <FeatureSection 
          title="Nghệ thuật của chuyển động."
          subtitle="Mỗi giọt Flux Pro là kết tinh của hàng triệu hạt nano, phản ứng tức thì với từ trường Neodymium siêu mạnh."
          bgImage="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000"
          dark={theme === 'dark'}
        />

        <section id="store" className="py-32 px-6 max-w-[1240px] mx-auto">
          <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-20 text-center">Bản Pro.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProductCard 
              name="Prisma Slate"
              price="4.5tr₫"
              description="Khối kính đa diện tối giản với ferrofluid đen tuyền tinh khiết."
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
            />
            <ProductCard 
              name="Orbital Walnut"
              price="6.2tr₫"
              description="Thiết kế hình cầu lơ lửng trên đế gỗ óc chó cao cấp."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
            />
            <ProductCard 
              name="Core Ultra"
              price="12tr₫"
              description="Phiên bản giới hạn với khả năng tương tác âm thanh."
              image="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800"
            />
          </div>
        </section>
      </main>

      <footer className="bg-black py-40 px-6 border-t border-white/10 mt-20">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              <h3 className="text-white text-lg font-semibold tracking-tight">FERROFLOW</h3>
            </div>
            <div className="flex gap-8">
              <Instagram className="text-white/40 hover:text-white cursor-pointer" size={20} />
              <Twitter className="text-white/40 hover:text-white cursor-pointer" size={20} />
              <Youtube className="text-white/40 hover:text-white cursor-pointer" size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-10">Sản phẩm</h4>
            <ul className="flex flex-col gap-4 text-white/40 font-light text-sm">
              <li className="hover:text-white cursor-pointer">Prisma Series</li>
              <li className="hover:text-white cursor-pointer">Orbital Series</li>
              <li className="hover:text-white cursor-pointer">Flux Pro 3D</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-10">Hỗ trợ</h4>
            <ul className="flex flex-col gap-4 text-white/40 font-light text-sm">
              <li className="hover:text-white cursor-pointer">Bảo hành</li>
              <li className="hover:text-white cursor-pointer">Giao hàng</li>
              <li className="hover:text-white cursor-pointer">Liên hệ</li>
            </ul>
          </div>
          <div className="text-white/20 text-xs">
            © 2026 FerroFlow Inc. Việt Nam.<br/>Sản phẩm kết hợp giữa nghệ thuật và vật lý nano.
          </div>
        </div>
      </footer>
    </div>
  );
}
