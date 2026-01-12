import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophie M.",
    service: "Volume Russe",
    rating: 5,
    text: "Une expérience absolument incroyable ! Dalee a su comprendre exactement ce que je voulais. Le résultat est magnifique, naturel et tellement élégant. Je recommande à 100% !",
    date: "Il y a 2 semaines",
  },
  {
    id: 2,
    name: "Marie L.",
    service: "Extension Classique",
    rating: 5,
    text: "Professionnalisme au top ! L'ambiance est zen, le salon est magnifique et les extensions sont parfaites. C'est ma nouvelle adresse beauté préférée.",
    date: "Il y a 1 mois",
  },
  {
    id: 3,
    name: "Camille R.",
    service: "Mega Volume",
    rating: 5,
    text: "Je suis cliente fidèle depuis 2 ans et je ne changerais pour rien au monde. Chaque rendez-vous est un moment de détente et le résultat est toujours à la hauteur de mes attentes.",
    date: "Il y a 3 semaines",
  },
  {
    id: 4,
    name: "Léa B.",
    service: "Hybride",
    rating: 5,
    text: "Première fois que je tente les extensions et je suis conquise ! Dalee m'a parfaitement conseillée et le résultat est sublime. Je me sens tellement belle !",
    date: "Il y a 1 semaine",
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="section-padding bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              Témoignages
            </span>
            <h2 className="heading-section mb-6">
              Ce que nos clientes
              <br />
              disent de nous
            </h2>
            <p className="text-secondary-foreground/70 mb-8 max-w-md">
              La satisfaction de nos clientes est notre plus belle récompense.
              Découvrez leurs témoignages et leur expérience chez Dalee_lashes.
            </p>

            {/* Rating Summary */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-semibold">
                    4.9
                  </span>
                  <Star className="w-6 h-6 fill-primary text-primary" />
                </div>
                <span className="text-sm text-secondary-foreground/60">
                  Note moyenne
                </span>
              </div>
              <div className="w-px h-12 bg-secondary-foreground/20" />
              <div className="flex flex-col">
                <span className="text-5xl font-display font-semibold">
                  120+
                </span>
                <span className="text-sm text-secondary-foreground/60">
                  Avis clients
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Testimonial Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-primary/20 rotate-180" />

            {/* Testimonial Card */}
            <div className="relative bg-secondary-foreground/5 rounded-2xl p-8 md:p-10 border border-secondary-foreground/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-primary text-primary"
                        />
                      )
                    )}
                  </div>

                  {/* Text */}
                  <p className="text-lg md:text-xl leading-relaxed mb-8">
                    "{testimonials[activeIndex].text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {testimonials[activeIndex].name}
                      </p>
                      <p className="text-sm text-secondary-foreground/60">
                        {testimonials[activeIndex].service} •{" "}
                        {testimonials[activeIndex].date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="absolute -bottom-5 right-8 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-secondary border border-secondary-foreground/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-secondary border border-secondary-foreground/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-secondary-foreground/30 hover:bg-secondary-foreground/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
