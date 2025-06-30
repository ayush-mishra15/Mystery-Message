"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { Mail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Zap, BadgeDollarSign } from "lucide-react"

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function Page() {
  const router = useRouter()

  const handleRedirect = () => {
    router.push("/sign-up")
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col items-center px-7 md:px-24 py-40">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Dive into the World of Anonymous Message
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-gray-300 max-w-xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Mystery Message – Where your identity stays hidden, but your voice is heard.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Button
              className="mt-6 text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
              onClick={handleRedirect}
            >
              Get Started
            </Button>
          </motion.div>
        </section>

        {/* Carousel Section */}
        <Carousel
          plugins={[Autoplay({ delay: 3500 })]}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mb-16"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem
                key={index}
                className="p-7 flex justify-center items-center"
              >
                <Card className="w-full bg-slate-950 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <CardHeader className="pb-2 border-b border-gray-700">
                    <CardTitle className="text-lg text-white font-semibold">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4 items-start py-4">
                    <div className="flex-shrink-0">
                      <Mail className="w-6 h-6 text-cyan-400 transition-colors duration-300" />
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

        {/* Who is it for? */}
        <motion.section
          className="max-w-4xl text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            variants={itemVariants}
          >
            <Users className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Who Is It For?</h2>
          </motion.div>
          <motion.p className="text-gray-400 mb-6 text-lg px-6 md:px-0" variants={itemVariants}>
            Whether you&#39;re a creator looking for honest feedback/Suggestion, a team leader wanting to improve,
            or simply someone who values genuine opinions.
          </motion.p>
        </motion.section>

        {/* Why True Feedback? */}
        <motion.section
          className="max-w-4xl text-center mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 className="text-2xl md:text-3xl font-bold mb-4" variants={itemVariants}>
            Why Mystery Message?
          </motion.h2>
          <motion.p className="text-gray-400 mb-6" variants={itemVariants}>
            People are often more honest when they&#39;re anonymous. Mystery Message provides a safe space to receive unfiltered, genuine thoughts that can lead to meaningful growth — whether you&#39;re a creator, a team leader, or simply someone seeking honest feedback.
          </motion.p>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-7 text-left text-sm md:text-base mt-14" variants={itemVariants}>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-md transition-transform duration-300 group hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                <h3 className="font-semibold text-lg text-white group-hover:text-emerald-200 transition-colors duration-300">100% Private</h3>
              </div>
              <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">No tracking, no identity. Just pure, anonymous Suggestions.</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-md transition-transform duration-300 group hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                <h3 className="font-semibold text-lg text-white group-hover:text-yellow-200 transition-colors duration-300">Simple & Fast</h3>
              </div>
              <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">Share your Message link, and start receiving messages instantly.</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-md transition-transform duration-300 group hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <BadgeDollarSign className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                <h3 className="font-semibold text-lg text-white group-hover:text-indigo-200 transition-colors duration-300">Completely Free</h3>
              </div>
              <p className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300">No subscriptions or hidden charges. Built for everyone.</p>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Mystery Message. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% {
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
  )
}

export default Page
