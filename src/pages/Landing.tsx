import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquare,
  BookOpen,
  Target,
  Shield,
  Zap,
  CheckCircle,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  PlayCircle,
  Award,
  Sparkles,
  Globe,
  Clock,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const testimonials = [
    {
      text: "This platform transformed how I approach difficult conversations. The AI insights are incredibly accurate.",
      author: "Sarah Chen",
      role: "VP of Engineering, TechCorp",
      rating: 5,
    },
    {
      text: "The reflective journaling feature helped me identify blind spots I never knew I had. Game-changing!",
      author: "Marcus Rodriguez",
      role: "Director of Operations",
      rating: 5,
    },
    {
      text: "Finally, a leadership tool that actually understands the nuances of authentic leadership development.",
      author: "Dr. Emily Watson",
      role: "Chief People Officer",
      rating: 5,
    },
  ];

  const stats = [
    { number: "500+", label: "Leaders Trained", icon: Users },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "AI Support", icon: Clock },
    { number: "50+", label: "Companies", icon: Globe },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations and deep insights into your leadership patterns with advanced analytics",
      color: "text-red-800 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/20",
      gradient:
        "from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20",
    },
    {
      icon: MessageSquare,
      title: "Dialogue Simulator",
      description:
        "Practice difficult conversations in a safe, AI-guided environment with real-time feedback",
      color: "text-yellow-700 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      gradient:
        "from-yellow-100 to-yellow-50 dark:from-yellow-950/30 dark:to-yellow-900/20",
    },
    {
      icon: BookOpen,
      title: "Reflective Journaling",
      description:
        "Voice and text journaling with intelligent prompts for deeper self-awareness and growth",
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/20",
      gradient:
        "from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20",
    },
    {
      icon: Target,
      title: "Adaptive Assessments",
      description:
        "Dynamic leadership assessments that evolve with your growth and learning patterns",
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/20",
      gradient:
        "from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description:
        "Track your development with comprehensive analytics, trends, and predictive insights",
      color: "text-gray-700 dark:text-gray-300",
      bg: "bg-gray-50 dark:bg-gray-950/20",
      gradient:
        "from-gray-100 to-gray-50 dark:from-gray-950/30 dark:to-gray-900/20",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your personal growth data is encrypted and completely private with enterprise-grade security",
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/20",
      gradient:
        "from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-25 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-800/10 to-yellow-600/10 dark:from-red-400/20 dark:to-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-green-700/10 to-yellow-600/10 dark:from-green-400/20 dark:to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-gradient-to-br from-red-800/10 to-green-700/10 dark:from-red-400/20 dark:to-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8 animate-fade-in">
            <Badge
              style={{
                background: "var(--landing-yellow)",
                color: "black", //black
              }}
              className="mb-6 px-6 py-2 text-sm font-semibold shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Beta Launch - Limited Time Offer
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-red-800 via-red-700 to-green-700 dark:from-red-400 dark:via-red-300 dark:to-green-400 bg-clip-text text-transparent leading-tight animate-slide-up">
            Develop Authentic
            <span className="block mt-2">Leadership</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up delay-200">
            Transform your leadership journey with AI-powered insights,
            reflective journaling, and practice dialogues designed for authentic
            growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-slide-up delay-400">
            <Button
              onClick={() => {
                window.location.href = "/auth";
              }}
              size="lg"
              className="bg-gradient-to-r from-red-800 to-red-700 dark:from-red-600 dark:to-red-500 text-white hover:from-red-900 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-red-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-4 border-2 border-white bg-white text-black hover:bg-gray-100 hover:text-red-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => {
                window.location.href = "/auth";
              }}
            >
              Learn More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up delay-600">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <stat.icon className="w-8 h-8 text-red-800 dark:text-red-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-red-800 dark:text-red-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 lg:py-32 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-colors duration-500"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 lg:mb-20">
            <Badge
              style={{
                background: "var(--landing-green)",
                color: "black", //black
              }}
              className="mb-6 px-4 py-2"
            >
              <Award className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-red-800 to-green-700 dark:from-red-400 dark:to-green-400 bg-clip-text text-transparent">
              Tools for Leadership Growth
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive features designed to accelerate your authentic
              leadership development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-500 border-0 bg-gradient-to-br ${feature.gradient} hover:-translate-y-2 transform cursor-pointer overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 lg:py-32 px-6 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 transition-colors duration-500"
      >
        <div className="container mx-auto max-w-6xl text-center">
          <Badge
            style={{
              background: "var(--landing-yellow)",
              color: "black", //black
            }}
            className="mb-6 px-4 py-2"
          >
            <Star className="w-4 h-4 mr-2" />
            Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-green-700 to-red-800 dark:from-green-400 dark:to-red-400 bg-clip-text text-transparent">
            Loved by Leaders Worldwide
          </h2>

          <div className="relative h-64 mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentTestimonial
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl max-w-4xl mx-auto">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-red-800 dark:bg-red-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 lg:py-32 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-500"
      >
        <div className="container mx-auto max-w-6xl text-center">
          <Badge
            style={{
              background: "var(--landing-red)",
              color: "black", //black
            }}
            className="mb-6 px-4 py-2"
          >
            <Zap className="w-4 h-4 mr-2" />
            Simple Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Choose Your Growth Path
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
            Start your leadership transformation today with our flexible pricing
            options
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Starter
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  $29
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Perfect for individual leaders
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    AI-powered insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Basic journaling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    5 dialogue simulations/month
                  </li>
                </ul>
                <Button
                  className="w-full bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
                  onClick={() => {
                    window.location.href = "/auth";
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-red-800 dark:border-red-500 bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-950/30 dark:to-yellow-950/30 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge
                  style={{
                    background: "var(--landing-red)",
                    color: "var(--landing-dark)",
                  }}
                  className="bg-red-800 dark:bg-red-600 text-white px-4 py-1"
                >
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Professional
                </CardTitle>
                <div className="text-4xl font-bold text-red-800 dark:text-red-400 mb-2">
                  $79
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  For serious leadership development
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Advanced AI insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Unlimited journaling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Unlimited simulations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Progress analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-red-800 to-red-700 dark:from-red-600 dark:to-red-500 text-white hover:from-red-900 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-red-600 shadow-lg">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-green-700 dark:border-green-500 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950/30 dark:to-yellow-950/30 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Enterprise
                </CardTitle>
                <div className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
                  Custom
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  For teams and organizations
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Team dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    Dedicated support
                  </li>
                </ul>
                <Button className="w-full bg-green-700 dark:bg-green-600 text-white hover:bg-green-800 dark:hover:bg-green-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 px-6 bg-gradient-to-br from-red-800 via-red-700 to-green-700 dark:from-red-900 dark:via-red-800 dark:to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Ready to Transform Your Leadership?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Join hundreds of leaders who are already using our platform to
            develop authentic, impactful leadership skills through AI-powered
            insights and personalized growth paths.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              onClick={() => {
                window.location.href = "/auth";
              }}
              className="text-lg px-10 py-4 bg-white text-red-800 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Zap className="h-5 w-5 mr-2" />
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                window.location.href = "/subscription";
              }}
              className="text-lg px-10 py-4 border-2 border-white bg-white text-black hover:bg-gray-100 hover:text-red-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              View Pricing
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 px-6 transition-colors duration-500">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-green-600 dark:from-red-500 dark:to-green-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold"> EchoStrong</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                Transform your leadership journey with AI-powered insights and
                authentic growth tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Careers
                  </a>{" "}
                  {/* Placeholder for future redirect */}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2025 EchoStrong. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }

        .delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }

        /* Dark mode styles */
        .dark {
          color-scheme: dark;
        }

        .dark ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .dark ::-webkit-scrollbar-track {
          background: rgb(17 24 39);
        }

        .dark ::-webkit-scrollbar-thumb {
          background: rgb(75 85 99);
          border-radius: 5px;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }

        /* Dark mode selection */
        .dark ::selection {
          background-color: rgb(239 68 68 / 0.3);
          color: rgb(255 255 255);
        }

        .dark ::-moz-selection {
          background-color: rgb(239 68 68 / 0.3);
          color: rgb(255 255 255);
        }
      `}</style>
    </div>
  );
};

export default Landing;
