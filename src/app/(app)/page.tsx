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
import { Mail, Users, Lock, Zap, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StarsBackground } from "@/components/ui/stars-background";

// Animation variants
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
      {/* Full Page Wrapper with Stars in Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <StarsBackground />
        <div className="relative z-0">
           
           {/* Main Section */}
          <main className="min-h-screen bg-transparent text-white  flex  flex-col items-center px-7 md:px-24 py-40">
            {/* Hero Section */}
            <section className="text-center mb-24 max-w-4xl z-40 mx-auto px-4">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-tl md:bg-gradient-to-b from-white via-gray-400 to-white bg-clip-text text-transparent"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Step Into the World of Anonymous Messages
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Mystery Message – Where your identity remains hidden, but your
                words leave an impact.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >

              <div className="relative inline-block mt-8 rounded-full p-[2px] bg-gradient-to-r from-[#3a8dde] via-[#7c5fff] to-[#a66cff] transition-all duration-300 group">
                <Button
                  onClick={handleRedirect}
                  className="px-7 py-3.5 rounded-full text-base font-semibold text-white bg-black 
                            transition-all duration-300 
                            group-hover:shadow-[0_0_15px_#7c5fff88]
                            group-hover:scale-100
                            active:scale-95"
                >
                  Get Started
                </Button>
              </div>



              </motion.div>
            </section>

            {/* Carousel Section */}
            <Carousel
              plugins={[Autoplay({ delay: 3500 })]}
              className="w-full max-w-md md:max-w-2xl ml-4 lg:max-w-3xl mb-16"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="p-7 flex justify-center items-center"
                  >
                    <Card className="w-full bg-black border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <CardHeader className="pb-2 border-b border-gray-700">
                        <CardTitle className="text-lg text-white font-semibold">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-4 items-start py-3">
                        <div className="flex-shrink-0">
                          <Mail className="w-6 h-6 text-cyan-500 transition-colors duration-300" />
                        </div>
                        <div>
                          <p className="mb-2 text-gray-300 leading-relaxed">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-400 italic">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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
                className="flex items-center justify-center gap-3 mb-5"
                variants={itemVariants}
              >
                <Users className="w-7 h-7 text-purple-500" />
                <h2 className="text-3xl font-bold text-white">Who Is It For?</h2>
              </motion.div>

              <motion.p
                className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Whether you’re a <span className="text-white font-medium">creator</span> seeking unfiltered suggestions, a <span className="text-white font-medium">team leader</span> looking for improvement, or just someone who values <span className="text-white font-medium">raw honesty</span> — Mystery Message gives you the truth, anonymously.
              </motion.p>
            </motion.section>

            {/* Why Mystery Message */}
            <motion.section
              className="max-w-5xl mx-auto text-center mb-28 px-4 md:px-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div
                className="flex items-center justify-center gap-3 mb-5"
                variants={itemVariants}
              >
                <ShieldCheck className="w-7 h-7 text-cyan-500" />
                <h2 className="text-3xl font-bold text-white">Why Mystery Message?</h2>
              </motion.div>

              <motion.p
                className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Honest feedback often hides behind fear of judgment. With Mystery Message, people can speak freely — <span className="text-white font-medium">no names</span>, <span className="text-white font-medium">no pressure</span>, just <span className="text-white font-medium">pure honesty</span> that helps you grow.
              </motion.p>


              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left text-sm md:text-base mt-20"
                variants={itemVariants}
              >
                {/* Card 1 */}
                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-700 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg hover:border-emerald-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors duration-300" />
                    <h3 className="font-semibold text-lg text-white group-hover:text-emerald-300 transition-colors duration-300">
                      100% Private
                    </h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                    No tracking, no identity. Just pure, anonymous Suggestions.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-700 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg hover:border-yellow-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
                    <h3 className="font-semibold text-lg text-white group-hover:text-yellow-300 transition-colors duration-300">
                      Simple & Fast
                    </h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                    Share your Message link, and start receiving messages instantly.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-700 shadow-md transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg hover:border-indigo-500">
                  <div className="flex items-center gap-3 mb-3">
                    <BadgeDollarSign className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400 transition-colors duration-300" />
                    <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors duration-300">
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

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </>
  );
}

export default Page;
