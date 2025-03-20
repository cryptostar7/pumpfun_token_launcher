import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/UI/Button';
import Header from '@/components/Layout/Header';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${y * -2}deg)`;
    };
    
    const handleMouseLeave = () => {
      if (!heroRef.current) return;
      heroRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    };
    
    const element = heroRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Launch</span> your tokens with style
                </h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-xl">
                  Create and deploy custom tokens on pump.fun with predefined beautiful templates and no-code solutions.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/launch">
                  <Button size="lg" className="rounded-full">
                    Launch Token
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-accent flex items-center justify-center text-xs font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">1,000+</span> tokens created
                </p>
              </div>
            </div>
            
            <div 
              ref={heroRef}
              className="w-full lg:w-1/2 transition-all duration-200 ease-out"
            >
              <div className="relative mx-auto w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-tr from-primary/30 to-primary opacity-30 blur-3xl animate-pulse-slow" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/b5d5b77e-4d2a-4f9b-ab4e-4fcb52a10acf.png"
                    alt="Minty Girl" 
                    className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full border-4 border-white shadow-lg animate-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white/50 backdrop-blur-md border-t border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4">Launch your custom token in minutes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                step: '01',
                title: 'Connect Your Wallet',
                description: 'Link your wallet to get started with the token creation process.'
              },
              {
                step: '02',
                title: 'Create Your Token',
                description: 'Customize your token with a name, symbol, and beautiful visuals.'
              },
              {
                step: '03',
                title: 'Launch & Share',
                description: 'Deploy your token and share it with your community.'
              }
            ].map((item, index) => (
              <div key={index} className="glassmorphism card-hover rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-12 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">MG</span>
              <span className="font-semibold">Minty Girl</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Minty Girl. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
