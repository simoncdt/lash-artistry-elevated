import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          src={heroImage}
          alt="Extensions de cils luxueuses"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="container-luxury relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft border border-primary/20 mb-8"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-primary text-primary"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              4.9 — Plus de 120 avis
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="heading-display mb-6"
          >
            L'art de sublimer
            <br />
            <span className="text-gradient-luxury">votre regard</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed"
          >
            Extensions de cils premium dans un écrin de douceur et d'élégance.
            Une expérience sur-mesure pour révéler votre beauté naturelle.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/reservation">
              <Button variant="luxury" size="xl" className="group w-full sm:w-auto">
                <Calendar className="w-5 h-5" />
                Réserver maintenant
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="luxury-outline" size="xl" className="w-full sm:w-auto">
                Découvrir nos services
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center gap-6 mt-12 pt-12 border-t border-border/50"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-display font-semibold text-foreground">
                500+
              </span>
              <span className="text-sm text-muted-foreground">
                Clientes satisfaites
              </span>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-3xl font-display font-semibold text-foreground">
                5 ans
              </span>
              <span className="text-sm text-muted-foreground">D'expertise</span>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-3xl font-display font-semibold text-foreground">
                100%
              </span>
              <span className="text-sm text-muted-foreground">
                Produits premium
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ["0%", "50%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
