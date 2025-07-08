"use client"

import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Play,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Check,
  Zap,
  Shield,
  Globe,
  Users,
  Puzzle,
  UploadCloud,
  ChartNoAxesCombined,
  Quote
} from "lucide-react";
import { useRef, ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import StarsCanvas from "@/app/components/starBackground"
import image1 from "@/public/remote-teams.jpg"
import image2 from "@/public/pair-programming.jpg"
import image3 from "@/public/code-reviews.jpg"
import test1 from "@/public/test2.png"
import test2 from "@/public/test3.png"
import test3 from "@/public/test4.png"

type AnimatedSectionProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

type GlowingButtonProps = {
  href: string;
  children: ReactNode;
  primary?: boolean;
  icon?: ReactNode | null;
  className?: string;
};

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
};

type TestimonialCardProps = {
  quote: string;
  author: string;
  position: string;
  company: string;
  image?: StaticImageData | null;
  delay?: number;
};

type PricingCardProps = {
  tier: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  gradient: string;
  border?: string;
  highlight?: boolean;
  cta: string;
  delay?: number;
};

const AnimatedSection = ({ children, delay = 0, className = "" } : AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const GlowingButton = ({ href, children, primary = false, icon = null, className = "" } : GlowingButtonProps) => {
  return (
    <Link
      href={href}
      className={`group relative px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-[1.03] overflow-hidden ${
        primary
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
          : "bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
      } ${className}`}
    >
      {/* Glow effect */}
      {primary && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/50 to-cyan-600/50 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></span>
      )}
      <span className="relative flex items-center z-10 cursor-pointer">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {!icon && primary && (
          <Play className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </span>
    </Link>
  )
}

const FeatureCard = ({ icon, title, description, gradient, delay = 0 } : FeatureCardProps) => {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="p-10 rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group h-full flex flex-col"
      >
        <div
          className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
        <div className="mt-8 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
          <span>Learn more</span>
          <Play className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </motion.div>
    </AnimatedSection>
  )
}

const TestimonialCard = ({ quote, author, position, company, image, delay = 0 } : TestimonialCardProps) => {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 h-full flex flex-col hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
      >
        {/* Rating stars */}
        <div className="flex mb-6 text-blue-400 text-xl">
          ★★★★★
        </div>

        {/* Quote symbol */}
        <div className="text-5xl text-blue-500/20 mb-4"><Quote /></div>

        <p className="text-gray-300 mb-8 flex-grow text-lg leading-relaxed">{quote}</p>

        <div className="flex items-center gap-4">
          <Image
            src={image || "/placeholder.svg?height=64&width=64"}
            alt={author}
            width={48}
            height={48}
            className="rounded-full border-2 border-blue-500/30"
          />
          <div>
            <div className="text-white font-semibold">{author}</div>
            <div className="text-blue-400 text-sm">{position}</div>
            <div className="text-gray-500 text-sm">{company}</div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  )
}

const PricingCard = ({ tier, price, period, description, features, gradient, border, highlight, cta, delay = 0 } : PricingCardProps) => {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ scale: highlight ? 1.05 : 1.02 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl p-8 bg-gradient-to-br ${gradient} backdrop-blur-sm border ${border} transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full flex flex-col relative`}
      >
        {highlight && (
          <div className="absolute -top-4 -right-4 py-1 px-3 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-blue-500/30">
            <span className="text-xs font-medium text-white">Most Popular</span>
          </div>
        )}

        <h4 className="text-2xl font-bold text-white mb-2">{tier}</h4>
        <div className="flex items-end mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          {period && <span className="text-gray-300 ml-1">{period}</span>}
        </div>
        <p className="text-gray-300 mb-6">{description}</p>

        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">
                <Check />
              </span>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/join"
          className={`inline-block px-6 py-3 ${
            highlight ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-white/10"
          } rounded-full text-white font-medium hover:shadow-lg ${
            highlight ? "hover:shadow-blue-500/30" : "hover:bg-white/20"
          } transition-all text-center`}
        >
          {cta}
        </Link>
      </motion.div>
    </AnimatedSection>
  )
}

export default function Home() {

  const { scrollYProgress } = useScroll()

  // Refs for intersection observers
  const heroRef = useRef(null)

  // Transform values for parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])


  return (
    <>
    <StarsCanvas />

    <main className="min-h-screen w-full bg-[#030014] font-sans overflow-hidden">
      {/* Hero Section with 3D Effect */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center px-4 md:px-8 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#030014] z-10" />

          {/* 3D Gradient Orbs */}
          <motion.div
            style={{ y: y1 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-1/4 right-1/3 w-128 h-128 rounded-full bg-cyan-600/20 blur-3xl"
          />
          <motion.div
            style={{ y: y3 }}
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-sky-600/10 blur-3xl"
          />

          {/* Mesh Gradient */}
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
          </div>
        </div>

        <motion.div style={{ opacity }} className="relative z-20 text-center max-w-6xl mx-auto">
          <AnimatedSection delay={0}>
            <div className="inline-block py-2 px-4 mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                ✨ Real-time Code Collaboration
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be] inline-block">
                Code
              </span>
              <br />
              <span className="text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  Fudji
                </span>
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for real-time code collaboration with WebRTC technology, enabling seamless teamwork
              for developers worldwide.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <GlowingButton href="/join" primary className="px-10 py-5 text-lg">
                Start Coding Now
              </GlowingButton>
              <GlowingButton href="/join" icon={<Play className="text-blue-400" />} className="px-10 py-5 text-lg">
                Watch Demo
              </GlowingButton>
            </div>
          </AnimatedSection>

          {/* Floating Badge */}
          <AnimatedSection delay={0.5}>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 py-2 px-4 bg-white/5 backdrop-blur-lg rounded-full border border-white/10">
              <div className="flex -space-x-2">
                {[test1, test2, test3].map((i, index) => (
                  <Image
                    key={index}
                    src={i}
                    alt={index.toString()}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007FFF] to-[#2a52be] flex items-center justify-center text-white text-xs border-2 border-[#030014]"
                  />
                ))}
              </div>
              <span className="text-white text-sm">+10,000 developers worldwide</span>
            </div>
          </AnimatedSection>
        </motion.div>
      </section>

      {/* Marquee Logos Section */}
      <section className="py-16 px-4 md:px-8 bg-[#030014] relative overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#030014] via-transparent to-[#030014] z-10 pointer-events-none"></div>
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
              TRUSTED BY DEVELOPERS EVERYWHERE
            </span>
          </div>
        </AnimatedSection>
        

        {/* Add CSS for the marquee effect */}
        <style jsx global>{`
          @keyframes slide {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          
          @keyframes slide-reverse {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          .logos-slide {
            animation: slide 30s infinite linear;
            display: flex;
            width: calc(250px * 16);
          }
          
          .logos-slide-reverse {
            animation: slide-reverse 30s infinite linear;
            display: flex;
            width: calc(250px * 16);
          }
          
          /* Custom font styles */
          @font-face {
            font-family: 'Geist';
            src: url('/fonts/Geist-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Geist';
            src: url('/fonts/Geist-Bold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
          }
          
          html {
            font-family: 'Geist', system-ui, sans-serif;
          }
          
          /* Gradient text animation */
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animated-gradient-text {
            background: linear-gradient(90deg, #60a5fa, #06b6d4, #3b82f6, #60a5fa);
            background-size: 300% 300%;
            animation: gradient-shift 8s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>
      </section>

      {/* Product Features Section */}
      <section className="py-32 px-4 md:px-8 bg-[#030014] relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col items-center mb-24">
              <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  POWERFUL FEATURES
                </span>
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
                <span className="animated-gradient-text">Collaborative Coding Reimagined</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl text-center">
                Experience the future of code collaboration with our cutting-edge WebRTC-powered platform
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Users className="text-5xl" />}
              title="Real-time Collaboration"
              description="Code together in real-time with multiple developers. See changes instantly as they happen with zero latency."
              gradient="from-blue-400 to-blue-600"
              delay={0}
            />
            <FeatureCard
              icon={<Users className="text-5xl" />}
              title="WebRTC Video Chat"
              description="Communicate face-to-face with built-in video conferencing. Discuss code changes while you work together."
              gradient="from-cyan-400 to-cyan-600"
              delay={0.2}
            />
            <FeatureCard
              icon={<Puzzle className="text-5xl" />}
              title="Powerful Extensions"
              description="Enhance your workflow with a rich ecosystem of extensions and integrations for all major development tools."
              gradient="from-sky-400 to-sky-600"
              delay={0.4}
            />
          </div>

          {/* Feature Showcase */}
          <div className="mt-32">
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                <div className="w-full lg:w-1/2">
                  <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                      ADVANCED TECHNOLOGY
                    </span>
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    Cutting-edge{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                      WebRTC Integration
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Our platform leverages the latest WebRTC technology to provide seamless, secure, and low-latency
                    collaboration for development teams of any size.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        icon: <Zap className="text-2xl text-blue-400" />,
                        title: "Ultra-Low Latency",
                        description: "Experience real-time updates with less than 50ms delay",
                      },
                      {
                        icon: <Shield className="text-2xl text-cyan-400" />,
                        title: "End-to-End Encryption",
                        description: "Your code and communications are fully encrypted and secure",
                      },
                      {
                        icon: <UploadCloud className="text-2xl text-sky-400" />,
                        title: "Automatic Cloud Sync",
                        description: "Never lose your work with continuous cloud synchronization",
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-4"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg">{feature.icon}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visual Element */}
                <div className="w-full lg:w-1/2 relative">
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square rounded-3xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-sky-900/20 border border-white/10 overflow-hidden relative shadow-2xl"
                  >
                    {/* Code editor visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-3/4 h-3/4 rounded-xl bg-[#0d0d1a] border border-white/10 overflow-hidden p-4 shadow-2xl"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="ml-4 text-xs text-gray-400">code-fudji.js</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="text-gray-500 text-xs mr-4">1</span>
                            <span className="text-blue-400 text-xs">function</span>
                            <span className="text-cyan-400 text-xs ml-1">collaborate</span>
                            <span className="text-white text-xs">()</span>
                            <span className="text-white text-xs"> {`{`}</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-500 text-xs mr-4">2</span>
                            <span className="text-white text-xs ml-4">console.</span>
                            <span className="text-green-400 text-xs">log</span>
                            <span className="text-white text-xs">(</span>
                            <span className="text-orange-400 text-xs">&apos;Coding together!&apos;</span>
                            <span className="text-white text-xs">);</span>
                          </div>
                          <div className="flex">
                            <span className="text-gray-500 text-xs mr-4">3</span>
                            <span className="text-white text-xs">{`}`}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Grid overlay effect */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30"></div>
                  </motion.div>

                  {/* Floating elements */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-6 -right-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007FFF] to-[#2a52be] flex items-center justify-center text-white text-2xl">
                        5ms
                      </div>
                      <div>
                        <div className="text-white font-semibold">Latency</div>
                        <div className="text-gray-400 text-sm">Industry Leading</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-6 -left-6 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xl">
                        100%
                      </div>
                      <div>
                        <div className="text-white font-semibold">Uptime</div>
                        <div className="text-gray-400 text-sm">Reliable Performance</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-[#030014] to-[#050020] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-cyan-600/10 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="flex flex-col items-center mb-20">
              <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  USE CASES
                </span>
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
                <span className="animated-gradient-text">Perfect For Every Team</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl text-center">
                Discover how Code Fudji transforms collaboration for development teams of all sizes
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Remote Teams",
                description:
                  "Bridge the gap between distributed team members with real-time collaboration that feels like you're in the same room.",
                image: image1,
                tags: ["Remote Work", "Team Collaboration", "Global Teams"],
                icon: <Globe className="text-2xl" />,
              },
              {
                title: "Pair Programming",
                description:
                  "Elevate your pair programming sessions with seamless code sharing, integrated video chat, and real-time feedback.",
                image: image2,
                tags: ["Agile", "XP", "Knowledge Sharing"],
                icon: <Users className="text-2xl" />,
              },
              {
                title: "Code Reviews",
                description:
                  "Transform code reviews from asynchronous comments to interactive sessions where issues get resolved in real-time.",
                image: image3,
                tags: ["Quality Assurance", "Mentoring", "Best Practices"],
                icon: <ChartNoAxesCombined className="text-2xl" />,
              },
            ].map((useCase, index) => (
              <AnimatedSection key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="group h-full rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10"
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={useCase.image}
                      alt={useCase.title}
                      fill={true}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] to-transparent opacity-70"></div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-white shadow-lg">
                        {useCase.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{useCase.title}</h3>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">{useCase.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {useCase.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs py-1 px-3 rounded-full bg-white/5 border border-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/"
                      className="inline-flex items-center text-violet-400 font-medium group-hover:text-violet-300 transition-colors"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.6}>
            <div className="mt-16 text-center">
              <GlowingButton href="/join" className="inline-flex items-center justify-center">
                View All Use Cases
                <ArrowRight className="ml-2" />
              </GlowingButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-[#030014] to-[#050024] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-violet-600/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-fuchsia-600/5 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-[url('/dots.svg')] bg-repeat opacity-5"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="flex flex-col items-center mb-20">
              <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/2 border border-violet-500/30">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  Testimonials
                </span>
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
                <span className="animated-gradient-text">What Developers Say</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl text-center">
                Join thousands of developers who have transformed their collaboration workflow with Code Fudji
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Code Fudji has completely transformed how our remote team collaborates. The WebRTC integration makes it feel like we're all coding in the same room."
              author="Sarah Chen"
              position="Lead Developer"
              company="TechStart Inc."
              image={test1}
              delay={0}
            />
            <TestimonialCard
              quote="The real-time collaboration features are incredible. We've cut our code review time in half and improved our overall code quality significantly."
              author="Marcus Johnson"
              position="Senior Engineer"
              company="DevFlow Systems"
              image ={test2}
              delay={0.2}
            />
            <TestimonialCard
              quote="As a coding instructor, Code Fudji has revolutionized how I teach. I can now pair program with students in real-time, no matter where they are located."
              author="Elena Rodriguez"
              position="Technical Educator"
              company="CodeAcademy Plus"
              image={test3}
              delay={0.4}
            />
          </div>

          {/* Statistics bar */}
          <AnimatedSection delay={0.4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="mt-20 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "50K+", label: "Active Users" },
                  { number: "1M+", label: "Coding Sessions" },
                  { number: "10K+", label: "Teams" },
                  { number: "99.9%", label: "Uptime" },
                ].map((stat, index) => (
                  <motion.div key={index} className="text-center" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                    <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 md:px-8 bg-[#030014] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl"
        ></motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="flex flex-col items-center mb-20">
              <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/2 border border-violet-500/30">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  PRICING PLANS
                </span>
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">
                <span className="animated-gradient-text">Simple, Transparent Pricing</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl text-center">
                Choose the perfect plan for your team&apos;s collaboration needs
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              tier="Free"
              price="$0"
              description="Perfect for individual developers and small projects"
              features={[
                "Up to 3 collaborators",
                "5 active projects",
                "Basic code editor",
                "Text chat",
                "7-day history",
              ]}
              gradient="from-gray-500/20 to-gray-600/20"
              border="border-gray-500/30"
              highlight={false}
              cta="Get Started Free"
              delay={0}
            />
            <PricingCard
              tier="Pro"
              price="$19"
              period="/month"
              description="Ideal for professional developers and growing teams"
              features={[
                "Up to 10 collaborators",
                "Unlimited projects",
                "Advanced code editor",
                "Video & text chat",
                "30-day history",
                "Custom themes",
                "Priority support",
              ]}
              gradient="from-violet-500/20 to-fuchsia-500/20"
              border="border-violet-500/30"
              highlight={true}
              cta="Start 14-Day Trial"
              delay={0.2}
            />
            <PricingCard
              tier="Team"
              price="$49"
              period="/month"
              description="For teams that need advanced collaboration features"
              features={[
                "Unlimited collaborators",
                "Unlimited projects",
                "Premium code editor",
                "HD video & text chat",
                "Unlimited history",
                "Custom themes",
                "24/7 priority support",
                "Admin controls",
                "SSO integration",
              ]}
              gradient="from-blue-500/20 to-violet-500/20"
              border="border-blue-500/30"
              highlight={false}
              cta="Contact Sales"
              delay={0.4}
            />
          </div>

          {/* FAQ Section */}
          <AnimatedSection delay={0.6}>
            <div className="mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 text-center">
                Frequently Asked{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  Questions
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    question: "How does the real-time collaboration work?",
                    answer:
                      "Code Fudji uses WebRTC technology to establish peer-to-peer connections between collaborators, enabling real-time code editing with minimal latency. Changes are synchronized instantly across all connected users.",
                  },
                  {
                    question: "Is my code secure on Code Fudji?",
                    answer:
                      "Absolutely. We use end-to-end encryption for all communications and code sharing. Your code never passes through our servers during collaboration sessions, ensuring maximum privacy and security.",
                  },
                  {
                    question: "Can I use Code Fudji with my existing development tools?",
                    answer:
                      "Yes! Code Fudji integrates with popular IDEs and development tools through extensions. We currently support VS Code, JetBrains IDEs, Sublime Text, and more.",
                  },
                  {
                    question: "What programming languages are supported?",
                    answer:
                      "Code Fudji supports all major programming languages including JavaScript, Python, Java, C++, Ruby, Go, PHP, and many more. Our syntax highlighting and code intelligence features work with over 100 languages.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-lg"
                  >
                    <h4 className="text-xl font-bold text-white mb-4">{faq.question}</h4>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection delay={0.8}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="mt-32 p-12 rounded-3xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-500/20 backdrop-blur-sm relative overflow-hidden shadow-2xl"
            >
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>

              {/* Animated glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-violet-500/10 blur-3xl"
              ></motion.div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="inline-block py-1 px-3 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/2 border border-violet-500/30">
                  <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                    GET STARTED TODAY
                  </span>
                </span>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Transform Your Coding Collaboration</h3>

                <p className="text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
                  Join thousands of developers who have revolutionized their workflow with Code Fudji&apos;s real-time
                  collaboration platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <GlowingButton href="/join" primary className="px-8 py-4 text-lg">
                    Start Coding Now
                  </GlowingButton>
                  <GlowingButton
                    href="/"
                    icon={<Play className="text-violet-400" />}
                    className="px-8 py-4 text-lg"
                  >
                    Watch Demo
                  </GlowingButton>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020010] border-t border-white/5 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-  bg-repeat opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-violet-600/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-fuchsia-600/5 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007FFF] to-[#2a52be]">
                  Code Fudji
                </div>
                <p className="text-gray-400 mt-4 leading-relaxed">
                  The ultimate platform for real-time code collaboration with WebRTC technology, enabling seamless
                  teamwork for developers worldwide.
                </p>
              </div>

              <div className="flex space-x-4">
                {[
                  { icon: <Twitter />, href: "" },
                  { icon: <Linkedin />, href: "" },
                  { icon: <Github />, href: "" },
                  { icon: <Instagram />, href: "" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-fuchsia-500/20 hover:text-white transition-all"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "" },
                  { label: "Pricing", href: "" },
                  { label: "Use Cases", href: "" },
                  { label: "Roadmap", href: "" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", href: "" },
                  { label: "Careers", href: "" },
                  { label: "Blog", href: "" },
                  { label: "Contact", href: "" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "Documentation", href: "" },
                  { label: "Tutorials", href: "" },
                  { label: "API", href: "" },
                  { label: "Community", href: "" },
                ],
              },
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold text-lg mb-6">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <motion.li key={linkIndex} whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                      <div className="text-gray-400 hover:text-violet-400 transition-colors cursor-pointer">
                        {link.label}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter subscription */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-violet-900/10 to-fuchsia-900/10 border border-violet-500/10 backdrop-blur-sm mb-16 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h4 className="text-2xl font-bold text-white mb-2">Stay Updated with Code Fudji</h4>
                <p className="text-gray-400 leading-relaxed">
                  Subscribe to our newsletter for the latest features, tutorials, and community updates.
                </p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 flex-grow"
                  />
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#007FFF] to-[#2a52be] text-white font-medium hover:shadow-lg hover:shadow-violet-500/20 transition-all transform hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom footer */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Code Fudji. All rights reserved.
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="text-gray-500 hover:text-violet-400 transition-colors cursor-pointer">
                Privacy Policy
              </div>
              <div className="text-gray-500 hover:text-violet-400 transition-colors cursor-pointer">
                Terms of Service
              </div>
              <div className="text-gray-500 hover:text-violet-400 transition-colors cursor-pointer">
                Cookie Policy
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </> 
  )
}