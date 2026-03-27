import * as React from 'react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const abrirWhatsApp = () => {
        const telefone = "555191305583";
        const mensagem = "Olá! Estava no site da Sigel e gostaria de solicitar um diagnóstico gratuito para o meu negócio.";
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const isActive = (path: string) => currentPath === path || (path === '/servicos' && currentPath.startsWith('/servicos'));

    const navLinks = [
        { label: 'Início', href: '/' },
        { label: 'Serviços', href: '/servicos' },
        { label: 'Planos', href: '/planos' },
        { label: 'Sobre nós', href: '/sobre' },
        { label: 'Serviços de Hardware e Software', href: '/servicos/hardware' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-surface-dark shadow-md border-b border-white/5 transition-all">
            <div className="max-w-7xl mx-auto px-5 md:px-12 py-3 flex flex-col md:flex-row items-center justify-between w-full">

                {/* Logo + Back Button */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-4">
                        {currentPath !== '/' && (
                            <button
                                onClick={() => window.history.back()}
                                aria-label="Voltar"
                                className="text-white flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                        )}
                        <a href="/" className="cursor-pointer flex items-center gap-4">
                            <img
                                src="/images/logo.png"
                                alt="Sigel Soluções em Informática"
                                className="h-24 md:h-32 lg:h-[9rem] object-contain py-1"
                            />
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        aria-label="Menu"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 mt-4 md:mt-0">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold transition-colors ${isActive(link.href)
                                    ? 'text-primary'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* WhatsApp Button Desktop */}
                    <button
                        onClick={abrirWhatsApp}
                        className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm ml-4 transition-all hover:scale-105 shadow-[0_0_15px_rgba(246,94,55,0.2)] ring-2 ring-accent/40 animate-pulse group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="transition-transform group-hover:scale-110">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                        </svg>
                        Diagnóstico Gratuito
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 bg-surface-dark w-full px-5 py-8 border-t border-white/5 shadow-2xl">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-base font-semibold transition-colors ${isActive(link.href)
                                    ? 'text-primary'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}

                    {/* WhatsApp Button Mobile */}
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            abrirWhatsApp();
                        }}
                        className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 w-full rounded-xl font-bold text-base mt-4 shadow-lg shadow-accent/20 transition-transform active:scale-95 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="transition-transform group-hover:scale-110">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                        </svg>
                        Diagnóstico Gratuito
                    </button>
                </div>
            )}
        </header>
    );
}