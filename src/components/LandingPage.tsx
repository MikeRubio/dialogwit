import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Bot,
  Database,
  Globe,
  Shield,
  Users,
  BarChart3,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Cpu,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import ParticlesBg from "particles-bg";
import { SEO } from "./SEO";
import { Helmet } from "react-helmet-async";
import { Logo } from "./ui/Logo";
import BoltLogo from "../resources/bolt-logo-white.png";
import { useTheme } from "../hooks/useTheme";

// Pricing card
type PricingCardProps = {
  name: string;
  price: string | number;
  description: string;
  features: string[];
  popular: boolean;
  delay?: number;
};

// Animated feature card
type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
};

const DemoChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Thanks for your message! I'm a demo chatbot powered by ChatterWise. In a real implementation, I would provide helpful responses based on your knowledge base.",
          sender: "bot",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-2" />
          <div>
            <h3 className="font-bold">ChatterWise Assistant</h3>
            <p className="text-xs opacity-80">Powered by AI</p>
          </div>
        </div>
      </div>
      <div className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary-500 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex mb-3">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-lg rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleSend}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-lg transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-100px" }}
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
      <Icon className="h-7 w-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const PricingCard = ({
  name,
  price,
  description,
  features,
  popular,
  delay = 0,
}: PricingCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-100px" }}
    whileHover={{ y: -10 }}
    className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${
      popular
        ? "border-primary-500 ring-4 ring-primary-500/20"
        : "border-gray-200 dark:border-gray-700"
    } overflow-hidden flex flex-col h-full`} // 👈 Add flex flex-col h-full to the card
  >
    {popular && (
      <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
        Most Popular
      </div>
    )}
    <div className="p-8 flex flex-col flex-grow">
      {" "}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {name}
      </h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          ${price}
        </span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {" "}
        {/* 👈 Add flex-grow here */}
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/pricing"
        className={`block w-full py-3 px-4 rounded-xl font-medium text-center transition-colors ${
          popular
            ? "bg-primary-600 hover:bg-primary-700 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {popular ? "Get Started" : "Learn More"}
      </Link>
    </div>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const chatbotRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (chatbotRef.current) observer.observe(chatbotRef.current);
    return () => {
      if (chatbotRef.current) observer.unobserve(chatbotRef.current);
    };
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ChatterWise",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "0",
        priceCurrency: "USD",
        unitText: "monthly subscription",
      },
    },
    description:
      "AI-powered chatbot platform for businesses. Build and deploy intelligent chatbots in minutes.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://chatterwise.io",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <SEO
        title="ChatterWise: No-Code AI Chatbot Builder for Teams & Customers"
        description="Build, train, and launch AI chatbots with your own data—no coding required. Start free, no credit card needed. Boost sales, customer service, and empower internal teams with ChatterWise."
        canonicalUrl="/"
        ogImage="https://bpzfivbuhgjpkngcjpzc.supabase.co/storage/v1/object/public/public-assets//chatterwise_page.jpg"
        schemaType="WebPage"
        schemaData={schemaData}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <div className="fixed inset-0 z-0 opacity-30 dark:opacity-20">
        <ParticlesBg type="cobweb" bg={true} color="#3B82F6" num={100} />
      </div>
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <Logo className="h-10 w-40 sm:h-12 sm:w-52" />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center space-x-4"
            >
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Link
                to="/pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                to="/documentation"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium"
              >
                Documentation
              </Link>
              <Link
                to="/blog"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium"
              >
                Blog
              </Link>
              <Link
                to="/auth"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Sign Up Free
              </Link>
            </motion.div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 mr-2" />
              ) : (
                <Moon className="h-5 w-5 mr-2" />
              )}
              Toggle Theme
            </button>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Pricing
            </Link>
            <Link
              to="/documentation"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-7 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Documentation
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Blog
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500"
            >
              Sign Up Free
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-6"
              >
                AI-Powered Chatbot Platform
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Build AI Chatbots with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400">
                  Your Knowledge
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
              >
                ChatterWise empowers businesses and teams to build, train, and
                deploy AI chatbots using their unique data—no coding required.
                Start for free and see how intelligent automation can transform
                your customer service, boost sales, and streamline internal
                operations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    Get Started Free
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/documentation"
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 px-8 py-4 rounded-xl text-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No credit card required
                </span>
              </motion.div>
            </motion.div>
            <motion.div
              ref={chatbotRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
                y: isVisible ? 0 : 20,
              }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="lg:w-1/2 flex justify-center"
            >
              <DemoChatbot />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Hackathon Badge */}
      <div className="flex justify-center mb-8 items-center relative z-10 min-h-[120px]">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={BoltLogo}
            className="max-w-[120px] w-full h-auto mx-auto sm:w-32 md:w-48 lg:w-64"
            alt="Bolt Logo"
          />
        </motion.a>
      </div>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0.3 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-400/10 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400/10 dark:bg-accent-400/5 rounded-full blur-3xl"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              With ChatterWise, you can build, train, and deploy AI chatbots in
              minutes—not months. Our intuitive platform guides you through each
              step, from uploading your content to integrating your chatbot
              across multiple channels. No technical expertise required.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform -translate-y-1/2 z-0"></div>
            {[
              {
                step: 1,
                title: "Upload Your Content",
                description:
                  "Add documents, FAQs, or any text content that contains your knowledge base.",
                icon: Database,
                delay: 0.1,
              },
              {
                step: 2,
                title: "Train Your Chatbot",
                description:
                  "Our AI automatically processes your content and creates a smart, context-aware chatbot.",
                icon: Cpu,
                delay: 0.3,
              },
              {
                step: 3,
                title: "Deploy & Integrate",
                description:
                  "Add your chatbot to your website, app, or platform with a simple embed code or API.",
                icon: Globe,
                delay: 0.5,
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.delay }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center relative z-10"
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary-500 shadow-lg">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features, Simple Interface
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover a comprehensive suite of tools designed to make AI
              accessible. From knowledge base integration to advanced analytics,
              ChatterWise gives you everything needed to create chatbots that
              deliver real business value—for sales, customer support, and
              internal teams.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Database}
              title="Knowledge Base Integration"
              description="Upload documents or add text content to train your chatbot with your specific information. Supports PDFs, Word, and web pages for easy setup."
              delay={0.1}
            />
            <FeatureCard
              icon={Cpu}
              title="Advanced AI Models"
              description="Powered by GPT-3.5 and GPT-4 with retrieval-augmented generation for accurate, context-aware responses. Perfect for complex queries and nuanced conversations."
              delay={0.2}
            />
            <FeatureCard
              icon={Globe}
              title="Multiple Integration Options"
              description="Embed your chatbot anywhere with our script tag, React components, or REST API. Seamlessly add AI chat to your website, app, or platform."
              delay={0.3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Comprehensive Analytics"
              description="Track performance metrics, user engagement, and conversation quality to continuously improve your chatbot and enhance customer experience."
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Work together to build, test, and refine your chatbots with role-based permissions. Empower your internal teams with shared access and streamlined workflows."
              delay={0.5}
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Robust security features including API key management, rate limiting, and detailed audit logs. Keep your data safe and your business compliant."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* FAQ & Use Cases Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              FAQs & Use Cases
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore how ChatterWise can help your business—whether you want to
              boost sales, improve customer service, or empower your internal
              teams.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* FAQ Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How does ChatterWise help increase sales?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ChatterWise chatbots can engage leads, answer product questions,
                and guide users through your sales funnel—24/7. By automating
                initial conversations, you increase conversion rates and free up
                your sales team for high-value interactions.
              </p>
            </motion.div>
            {/* FAQ Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Can ChatterWise be used for internal team support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! ChatterWise is ideal for internal knowledge sharing.
                Empower your teams with instant access to company policies,
                procedures, and best practices—reducing repetitive questions and
                improving productivity.
              </p>
            </motion.div>
            {/* FAQ Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                What types of data can I use to train my chatbot?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can upload PDFs, Word documents, web pages, or simply add
                text. Our platform supports a wide range of formats to ensure
                your chatbot is trained on the most relevant and up-to-date
                information.
              </p>
            </motion.div>
            {/* Use Case Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Customer Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automate responses to common queries, reduce response times, and
                provide consistent, accurate support—day or night.
              </p>
            </motion.div>
            {/* Use Case Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Sales & Lead Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage website visitors, qualify leads, and schedule
                meetings—all through conversational AI.
              </p>
            </motion.div>
            {/* Use Case Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Internal Knowledge Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Empower employees with instant access to company knowledge,
                onboarding materials, and best practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative z-10 flex flex-col min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Start for free, upgrade as you grow
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-grow">
            <PricingCard
              name="Chatterwise Free"
              price="0"
              description="Perfect for getting started and testing the platform."
              features={[
                "20,000 tokens per month",
                "GPT-3.5 model",
                "Basic support",
                "Community access",
              ]}
              popular={false}
              delay={0.1}
            />
            <PricingCard
              name="Chatterwise Starter"
              price="19"
              description="Perfect for indie developers or small teams. Includes GPT-3.5 and increased document uploads."
              features={[
                "200,000 tokens per month",
                "GPT-3.5 model",
                "Email support",
                "Analytics dashboard",
                "API access",
              ]}
              popular={true}
              delay={0.3}
            />
            <PricingCard
              name="Chatterwise Growth"
              price="79"
              description="For organizations with advanced needs."
              features={[
                "1,000,000 tokens per month",
                "GPT-4 model access",
                "Priority support",
                "Webhook integrations",
              ]}
              popular={false}
              delay={0.5}
            />
            <PricingCard
              name="Chatterwise Business"
              price="249"
              description="Enterprise-grade chatbot infrastructure."
              features={[
                "5,000,000 tokens per month",
                "GPT-4 model access",
                "Extended support",
                "Custom KB scaling",
                "Webhook integrations",
              ]}
              popular={false}
              delay={0.5}
            />
          </div>
        </div>
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex justify-center">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-primary-700 transition-all">
              Get Started Free
            </button>
          </div>
        </div> */}
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-800 dark:to-accent-700">
          <motion.div
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
              backgroundSize: "30%",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Build Your AI Chatbot?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Join thousands of businesses using ChatterWise to create
              intelligent, context-aware chatbots.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/auth"
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform"
                >
                  Start Building Free
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/pricing"
                  className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center">
                <Logo className="h-12 w-52" />
              </div>
              <p className="mt-4 text-gray-400">
                Building the future of AI-powered conversations.
              </p>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0 2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/integrations"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/documentation"
                    className="text-gray-4 hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api-reference"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center relative z-10 min-h-[120px]">
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={BoltLogo}
                  className="max-w-[120px] w-full h-auto mx-auto sm:w-32 md:w-48 lg:w-64"
                  alt="Bolt Logo"
                />
              </motion.a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 ChatterWise. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://www.iubenda.com/privacy-policy/16849142"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.iubenda.com/terms-and-conditions/16849142"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms and Conditions
              </a>
              <a
                href="https://www.iubenda.com/privacy-policy/16849142/cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
