import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { ChevronRight, Menu, X, Instagram, Twitter, Youtube, Sun, Moon, Globe, ArrowUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FerroSpace from "./components/FerroSpace";
import FerroCanvas from "./components/FerroCanvas";
import { translations } from "./lib/translations";

type Lang = 'vi' | 'en' | 'zh' | 'ja';

/**
 * FERROFLOW - Apple-inspired Ferrofluid Display Website
 */

const ScrollToTop = ({ theme }: { theme: 'dark' | 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            theme === 'dark' 
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' 
              : 'bg-black/5 hover:bg-black/10 text-black border border-black/10'
          } backdrop-blur-xl`}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ 
  theme, 
  toggleTheme, 
  lang, 
  setLang,
  t 
}: { 
  theme: 'dark' | 'light', 
  toggleTheme: () => void, 
  lang: Lang, 
  setLang: (l: Lang) => void,
  t: any
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];

  const currentFlag = languages.find(l => l.code === lang)?.flag;

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? (theme === 'dark' ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-white/80 backdrop-blur-xl border-b border-black/10') : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-20 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            href="#" className="flex items-center gap-2 group"
          >
            <svg className={`w-3.5 h-3.5 transition-transform group-hover:rotate-12 ${theme === 'dark' ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            <span className={`font-bold text-xs md:text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>FERROFLOW</span>
          </motion.a>
          <div className="hidden lg:flex gap-8">
            <a href="#store" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}>{t.nav.store}</a>
            <a href="#kinetic" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}>{t.nav.kinetic}</a>
            <a href="#support" className={`text-xs font-light transition-colors ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'}`}>{t.nav.support}</a>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/5' : 'bg-black/5 hover:bg-black/10 text-black/80 border border-black/5'}`}
            >
              <span className="text-sm drop-shadow-sm leading-none">{currentFlag}</span>
              <span className="uppercase tracking-widest hidden sm:inline">{lang}</span>
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  className={`absolute top-full right-0 mt-2 p-1.5 rounded-2xl border shadow-2xl min-w-[160px] backdrop-blur-3xl z-[60] ${theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/10'}`}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as Lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-medium transition-all mb-1 last:mb-0 flex items-center gap-3 relative ${
                        lang === l.code 
                          ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black font-bold') 
                          : (theme === 'dark' ? 'hover:bg-white/5 text-white/50' : 'hover:bg-black/5 text-black/50')
                      }`}
                    >
                      <span className="text-lg drop-shadow-sm leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <div className="ml-auto w-1 h-1 rounded-full bg-blue-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={13} className="text-white" /> : <Moon size={13} className="text-black" />}
              </motion.div>
            </AnimatePresence>
          </button>
          
          <button className={`md:hidden p-1.5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-14 left-0 w-full p-4 flex flex-col gap-2 md:hidden border-b overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
          >
            <a href="#store" className={`text-base font-semibold px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`} onClick={() => setIsOpen(false)}>{t.nav.store}</a>
            <a href="#kinetic" className={`text-base font-semibold px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`} onClick={() => setIsOpen(false)}>{t.nav.kinetic}</a>
            <a href="#support" className={`text-base font-semibold px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`} onClick={() => setIsOpen(false)}>{t.nav.support}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const KineticSection = ({ theme, t }: { theme: 'dark' | 'light', t: any }) => {
  return (
    <div className={`w-full h-[400px] md:h-[600px] rounded-[32px] md:rounded-[48px] overflow-hidden border relative group cursor-crosshair shadow-2xl transition-colors duration-700 ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}>
      <FerroSpace activeSection={0} theme={theme} />
      <div className="absolute top-6 md:top-8 left-6 md:left-8 pointer-events-none">
        <p className={`${theme === 'dark' ? 'text-white/40' : 'text-black/40'} text-[8px] md:text-[10px] uppercase tracking-widest font-bold mb-2`}>{t.features.kinetic.simName}</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <p className={`${theme === 'dark' ? 'text-white/10' : 'text-black/10'} text-[9px] uppercase tracking-[1em] font-bold`}>{t.features.kinetic.nanoPhysics}</p>
      </div>
    </div>
  );
};

const Hero = ({ t }: { t: any }) => {
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
          {t.hero.tag}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-5xl md:text-9xl font-semibold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
        >
          {t.hero.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/80 text-xl md:text-3xl font-light tracking-tight mb-10 max-w-2xl mx-auto leading-tight"
        >
          {t.hero.subtitle}
        </motion.p>
        <div className="flex gap-6 justify-center items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-10 py-4 rounded-full text-base font-medium transition-all shadow-xl shadow-blue-500/20"
          >
            {t.hero.buy}
          </motion.button>
          <button className="text-[#2997ff] hover:underline flex items-center gap-1 text-base font-medium group">
            {t.hero.learn} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = ({ title, subtitle, bgImage, dark = true, reverse = false }: { title: string, subtitle: string, bgImage: string, dark?: boolean, reverse?: boolean }) => {
  return (
    <section className={`relative min-h-[70vh] flex items-center py-16 md:py-32 px-4 md:px-6 ${dark ? 'bg-black/40 text-white' : 'bg-white/40 text-black'}`}>
      <div className={`max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className={reverse ? 'md:order-2' : ''}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-semibold tracking-tighter mb-6 md:mb-8 leading-tight">
              {title}
            </h2>
            <p className="text-lg md:text-2xl font-light tracking-tight leading-relaxed opacity-60">
              {subtitle}
            </p>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className={`relative aspect-video md:aspect-[4/3] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-white/10 ${reverse ? 'md:order-1' : ''}`}
        >
          <img src={bgImage} alt={title} className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ name, price, description, image, theme }: { name: string, price: string, description: string, image: string, theme: 'dark' | 'light' }) => {
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
      className={`rounded-[32px] md:rounded-[48px] p-6 md:p-12 flex flex-col h-full group border transition-all duration-700 relative overflow-hidden ${theme === 'dark' ? 'bg-[#1d1d1f] border-white/5 active:bg-[#2c2c2e]' : 'bg-white border-black/5 shadow-xl active:bg-gray-50'}`}
    >
      <div className="flex-1 mb-6 md:mb-10 overflow-hidden rounded-[24px] md:rounded-[32px] relative shadow-2xl">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'bg-black/20 group-hover:opacity-0' : 'bg-white/10 group-hover:opacity-0'}`} />
      </div>
      <h3 className={`text-2xl md:text-3xl font-semibold mb-2 md:mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{name}</h3>
      <p className={`text-sm md:text-base font-light mb-6 md:mb-8 leading-relaxed opacity-50 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{price}</span>
        <button className="bg-[#0071e3] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#0077ed] transition-all transform group-hover:translate-x-2">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Lang>('vi');
  const [transitioning, setTransitioning] = useState(false);

  const t = translations[lang];

  const toggleTheme = () => {
    setTransitioning(true);
    setTimeout(() => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      setTimeout(() => setTransitioning(false), 300); // Faster, more premium transition
    }, 150);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#fafafa] text-[#1d1d1f]'}`}>
      <FerroCanvas theme={theme} />
      <ScrollToTop theme={theme} />
      
      {/* Subtle Overlay during transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white/5 pointer-events-none backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        setLang={setLang}
        t={t}
      />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Hero t={t} />
            
            <div className={`h-32 md:h-40 border-y transition-colors duration-700 flex items-center justify-around px-4 md:px-24 backdrop-blur-md ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
              <div className="text-center group">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className={`font-bold text-xl md:text-5xl tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  99.9%
                </motion.p>
                <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-2 md:mt-3 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{t.features.stats.nano}</p>
              </div>
              <div className="text-center group">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`font-bold text-xl md:text-5xl tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  Glass 4K
                </motion.p>
                <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-2 md:mt-3 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{t.features.stats.glass}</p>
              </div>
              <div className="text-center group">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`font-bold text-xl md:text-5xl tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  3D Core
                </motion.p>
                <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-2 md:mt-3 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{t.features.stats.sim}</p>
              </div>
            </div>

            <section id="kinetic" className="py-20 md:py-40 px-4 md:px-6 max-w-[1240px] mx-auto overflow-hidden">
              <div className="mb-12 md:mb-24">
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className={`text-5xl md:text-8xl font-bold tracking-tighter mb-6 md:mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`}
                >
                  {t.features.kinetic.title}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-lg md:text-3xl font-light tracking-tight max-w-3xl leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-black/60'}`}
                >
                  {t.features.kinetic.desc}
                </motion.p>
              </div>
              <KineticSection theme={theme} t={t} />
            </section>

            <FeatureSection 
              title={t.features.movement.title}
              subtitle={t.features.movement.subtitle}
              bgImage="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000"
              dark={theme === 'dark'}
            />

            <section id="store" className="py-20 md:py-40 px-4 md:px-6 max-w-[1240px] mx-auto">
              <h2 className={`text-6xl md:text-9xl font-bold tracking-tighter mb-12 md:mb-24 text-center ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`}>{t.products.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                <ProductCard 
                  name={t.products.items.prisma.name}
                  price={t.products.items.prisma.price}
                  description={t.products.items.prisma.desc}
                  image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
                  theme={theme}
                />
                <ProductCard 
                  name={t.products.items.orbital.name}
                  price={t.products.items.orbital.price}
                  description={t.products.items.orbital.desc}
                  image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                  theme={theme}
                />
                <ProductCard 
                  name={t.products.items.core.name}
                  price={t.products.items.core.price}
                  description={t.products.items.core.desc}
                  image="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800"
                  theme={theme}
                />
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className={`py-20 md:py-40 px-6 border-t mt-20 transition-colors duration-700 ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-[#f5f5f7] border-black/5'}`}>
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
          <div>
            <div className="flex items-center gap-2 mb-8 md:mb-10">
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'fill-white' : 'fill-black'}`} viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              <h3 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>FERROFLOW</h3>
            </div>
            <div className="flex gap-8">
              <Instagram className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/30 hover:text-black'} cursor-pointer transition-colors`} size={18} />
              <Twitter className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/30 hover:text-black'} cursor-pointer transition-colors`} size={18} />
              <Youtube className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/30 hover:text-black'} cursor-pointer transition-colors`} size={18} />
            </div>
          </div>
          <div>
            <h4 className={`font-bold mb-6 md:mb-10 text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t.nav.store}</h4>
            <ul className={`flex flex-col gap-4 font-light text-sm ${theme === 'dark' ? 'text-white/40' : 'text-black/50'}`}>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.prisma}</li>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.orbital}</li>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.flux}</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-6 md:mb-10 text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t.nav.support}</h4>
            <ul className={`flex flex-col gap-4 font-light text-sm ${theme === 'dark' ? 'text-white/40' : 'text-black/50'}`}>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.warranty}</li>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.shipping}</li>
              <li className="hover:text-current cursor-pointer transition-colors">{t.footer.links.contact}</li>
            </ul>
          </div>
          <div className={`${theme === 'dark' ? 'text-white/20' : 'text-black/40'} text-[10px] leading-loose`}>
            {t.footer.copy}<br/>{t.footer.desc}
          </div>
        </div>
      </footer>
    </div>
  );
}
