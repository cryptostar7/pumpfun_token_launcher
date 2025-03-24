
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import FileUpload from '@/components/UI/FileUpload';
import { toast } from 'sonner';
import { generateCA } from '@/lib/generateCA';

type FormData = {
  name: string;
  symbol: string;
  description: string;
  tokenLogo: File | null;
  media: File | null;
  privateKey: string;
  twitter: string;
  telegram: string;
  website: string;
  initialBuyAmount: string;
};

const LaunchToken = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    symbol: '',
    description: '',
    tokenLogo: null,
    media: null,
    privateKey: '',
    twitter: '',
    telegram: '',
    website: '',
    initialBuyAmount: '',
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showSocial, setShowSocial] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleLogoChange = (file: File | null) => {
    setFormData({ ...formData, tokenLogo: file });
  };

  const handleMeidaChange = (file: File | null) => {
    setFormData({ ...formData, media: file });
  };
  
  const handleSelectWallet = () => {
    toast.success('Continue to next step to launch token.');
    setCurrentStep(2);
  };

  // const handleGenerateCA = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   toast.success('Generate CA is clicked.');
  //   generateCA(formData);
  // }

  const handleAddSocialLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSocial(!showSocial);
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Token launch initiated! Your token will be live soon.');
    generateCA(formData);
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">Launch Your Token</h1>
            <p className="text-muted-foreground mt-2">Create and deploy your custom token in minutes</p>
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step <= currentStep 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`w-16 h-0.5 ${
                        step < currentStep ? 'bg-primary' : 'bg-secondary'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <Card className="shadow-soft overflow-hidden">
            <CardHeader className="bg-accent/50 border-b px-6 py-4">
              <CardTitle className="flex items-center justify-between">
                <span>{currentStep === 1 ? 'Launch Token' : currentStep === 2 ? 'Token Details' : 'Launch Token'}</span>
                <div className="text-sm font-normal text-muted-foreground">Step {currentStep} of 3</div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {currentStep === 1 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Launch Your Token</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-8">
                    Click the below button to create and manage your custom token on the pump.fun.
                  </p>
                  <Button onClick={handleSelectWallet} className="rounded-full">
                    Click Me to Continue
                  </Button>
                </div>
              ) : currentStep === 2 ? (
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground">Token Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter token name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground">Symbol</label>
                      <input
                        type="text"
                        name="symbol"
                        placeholder="Enter token symbol (e.g. BTC)"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={4}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md transition-all duration-200 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                        placeholder="Describe your token..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <FileUpload 
                      label="Token Logo"
                      fileType='image/*'
                      onFileChange={handleLogoChange}
                    />

                    <FileUpload 
                      label="Media File"
                      fileType='video/*'
                      onFileChange={handleMeidaChange}
                    />

                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Your Private Key
                      </label>
                      <input
                        type="text"
                        name="privateKey"
                        placeholder='Enter Your Private Key'
                        value={formData.privateKey}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <Button
                        className='w-full'
                        onClick={handleAddSocialLink}
                      >
                        {showSocial? 'Hide Social Link' : 'Add Social Link'}
                      </Button>
                    </div>

                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground" hidden={!showSocial}>
                        Twitter URL
                      </label>
                      <input
                        type="text"
                        name="twitter"
                        placeholder='https://twitter.com/yourhandle'
                        value={formData.twitter}
                        hidden={!showSocial}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground" hidden={!showSocial}>
                        Telegram URL
                      </label>
                      <input
                        type="text"
                        name="telegram"
                        placeholder='https://t.me/yourhandle'
                        value={formData.telegram}
                        hidden={!showSocial}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground" hidden={!showSocial}>
                        Website URL
                      </label>
                      <input
                        type="text"
                        name="website"
                        placeholder='https://yourwebsite.com'
                        value={formData.website}
                        hidden={!showSocial}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <label className="text-sm font-medium text-foreground">Initial Buy Amount (SOL)</label>
                      <input
                        type="text"
                        name="initialBuyAmount"
                        value={formData.initialBuyAmount}
                        placeholder='Enter your initial buy amount'
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-input rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="py-6">
                  <div className="bg-accent/50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Token Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{formData.name || "Minty Girl Token"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Symbol:</span>
                        <span className="font-medium">{formData.symbol || "MGT"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Initial Amount:</span>
                        <span className="font-medium">{formData.initialBuyAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <input type="checkbox" id="terms" className="mr-2" />
                      <label htmlFor="terms" className="text-sm">
                        I confirm this is a legitimate token and I understand the risks involved.
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                    >
                      Launch your Token
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default LaunchToken;
