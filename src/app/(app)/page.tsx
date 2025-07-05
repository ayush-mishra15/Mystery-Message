"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Mail,
  Users,
  Lock,
  Zap,
  BadgeDollarSign,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StarsBackground } from "@/components/ui/stars-background";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Page() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/sign-up");
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <StarsBackground />

        <div className="relative z-0">
          <main className="min-h-screen bg-transparent text-white flex flex-col items-center px-7 md:px-24 py-40">
            {/* Hero Section */}
            <section className="text-center mb-24 max-w-4xl z-40 mx-auto px-4">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-normal text-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Step Into the World of{" "}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-green-400">
                  Anonymous Messages
                </span>
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto text-center tracking-normal"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Mystery Message – Where your identity remains hidden, but your words leave an impact.
              </motion.p>


              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <div className="relative inline-block mt-8 rounded-full p-[2px] bg-gradient-to-r from-indigo-500 via text-teal-700 to-cyan-500 shadow-[0_0_16px_#4fd1c5]">
                  <Button
                    onClick={handleRedirect}
                    className="px-7 py-4 rounded-full text-base font-semibold text-gray-100 bg-black shadow-2xs transition-all duration-300 hover:scale-[1.03] active:scale-95"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            </section>

            {/* Carousel */}
            <Carousel
              plugins={[Autoplay({ delay: 3500 })]}
              className="w-full max-w-lg md:max-w-2xl ml-4 lg:max-w-3xl mb-16"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="py-1 px-7 flex justify-center items-center"
                  >
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="w-full"
                    >
                      <Card className="relative group w-full bg-gray-950 border border-gray-800 rounded-2xl shadow-md hover:shadow-[0_0_25px_#7c5fff55] hover:border-indigo-400 hover:scale-[1.02] transition-all duration-300">
                        {/* Soft floating quote icon */}
                        <div className="absolute top-2 right-3 text-5xl text-gray-800 group-hover:text-gray-700 transition duration-300 pointer-events-none select-none">
                          “
                        </div>

                        <CardHeader className="border-gray-700">
                          <CardTitle className="text-lg text-white font-semibold tracking-wide">
                            {message.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="flex items-start gap-4 pt-1 pb-3">
                          {/* Glass icon wrapper */}
                          <div className="p-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full shadow-[0_0_15px_rgba(124,95,255,0.3)]">
                            <Mail className="w-5 h-5 text-cyan-400" />
                          </div>

                          <div>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-1">
                              {message.content}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                              {message.received}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>


          {/* Who Is It For */}
          <motion.section
            className="max-w-5xl mx-auto text-center mb-24 px-4 md:px-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              variants={itemVariants}
            >
              <Users className="w-8 h-8 text-purple-500" />
              <h2 className=" text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                Who Is It For?
              </h2>
            </motion.div>

            <motion.p
              className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Whether you’re a <span className="text-white font-medium">creator</span> seeking unfiltered suggestions, a <span className="text-white font-medium">team leader</span> looking for improvement, or just someone who values <span className="text-white font-medium">raw honesty</span> — Mystery Message gives you the truth, anonymously.
            </motion.p>
          </motion.section>

            {/* Why Mystery Message */}
            <motion.section
              className="max-w-5xl text-center mb-28 px-1 md:px-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
            <motion.div
              className="flex items-center justify-center gap-1 md:gap-2 mb-6"
              variants={itemVariants}
            >
              <div >
                <ShieldCheck className="w-9 h-9 text-cyan-400" />
              </div>
              <h2 className=" text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-snug">
                Why Mystery Message?
              </h2>
            </motion.div>


            <motion.p
              className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Honest feedback often hides behind fear of judgment. With Mystery Message, people can speak freely — <span className="text-white font-medium">no names</span>, <span className="text-white font-medium">no pressure</span>, just <span className="text-white font-medium">pure honesty</span> that helps you grow.
            </motion.p>

              {/* Features Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left text-sm md:text-base mt-20"
              variants={itemVariants}
            >
              {/* Card 1 */}
              <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_0_20px_#10b98144] hover:border-emerald-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-600/10 rounded-full">
                    <Lock className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
                    100% Private
                  </h3>
                </div>
                <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                  No tracking, no identity. Just pure, anonymous Suggestions.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_0_20px_#facc1544] hover:border-yellow-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Zap className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-white tracking-tight group-hover:text-yellow-300 transition-colors duration-300">
                    Simple & Fast
                  </h3>
                </div>
                <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                  Share your Message link, and start receiving messages instantly.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_0_20px_#6366f144] hover:border-indigo-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500/10 rounded-full">
                    <BadgeDollarSign className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-white tracking-tight group-hover:text-indigo-300 transition-colors duration-300">
                    Completely Free
                  </h3>
                </div>
                <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                  No subscriptions or hidden charges. Built for everyone.
                </p>
              </div>
            </motion.div>

                        </motion.section>
                      </main>

                      {/* Footer */}
                      <footer className="bg-black text-gray-400 py-8 text-center">
                        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4">
                          <p className="text-sm">
                            © {new Date().getFullYear()} Mystery Message. All rights reserved.
                          </p>
                        </div>
                      </footer>
                    </div>
                  </div>
                </>
              );
            }

            export default Page;