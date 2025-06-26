import React, { useState } from 'react';
import { Sparkles, Zap, Code, Palette, ArrowRight, Globe } from 'lucide-react';


interface LandingPageProps {
  onPromptSubmit: (prompt: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submitting prompt:", prompt);

    e.preventDefault();
    if (prompt.trim()) {
      
      setIsLoading(true);
      // Simulate processing time
      setTimeout(() => {
        onPromptSubmit(prompt.trim());
        setIsLoading(false);
      }, 1000);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate websites in seconds with AI-powered technology"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Clean Code",
      description: "Production-ready code with modern frameworks and best practices"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Stunning, responsive designs that work on all devices"
    }
  ];

  const examples = [
    "Create a modern portfolio website for a photographer",
    "Build an e-commerce site for selling handmade jewelry",
    "Design a landing page for a SaaS startup",
    "Make a blog website for food recipes",
    "Create a business website for a local restaurant"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WebCraft AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#examples" className="text-gray-300 hover:text-white transition-colors">Examples</a>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build Websites with
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> AI Magic</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your ideas into stunning websites instantly. Just describe what you want, and our AI will build it for you.
            </p>
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Describe your website</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a modern portfolio website for a photographer with a dark theme, image gallery, and contact form..."
                  className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Website</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Features */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:bg-gray-800/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Example Prompts */}
          <div id="examples" className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Try These Examples</h2>
            <div className="grid gap-3">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 text-gray-300 hover:text-white"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;