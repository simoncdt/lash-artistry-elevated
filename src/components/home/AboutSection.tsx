import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Phone, Award, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import salonImage from "@/assets/salon.jpg";

const features = [
  {
    icon: Award,
    title: "Expertise certifiée",
    description: "Formation continue et techniques de pointe",
  },
  {
    icon: Heart,
    title: "Approche personnalisée",
    description: "Chaque regard est unique, nos conseils aussi",
  },
  {
    icon: Shield,
    title: "Produits premium",
    description: "Seulement les meilleures marques pour votre beauté",
  },
];

export const AboutSection = () => {
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={salonImage}
                alt="Notre salon Dalee_lashes"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:right-6 bg-card p-6 rounded-xl shadow-luxury border border-border/50 max-w-xs"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Horaires</p>
                  <p className="text-sm text-muted-foreground">Lun - Dim</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matin</span>
                  <span className="font-medium">9h - 12h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Après-midi</span>
                  <span className="font-medium">13h - 21h</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              À propos
            </span>
            <h2 className="heading-section mb-6">
              Un écrin de beauté
              <br />
              dédié à votre regard
            </h2>
            <p className="text-body mb-8">
              Bienvenue chez <strong className="text-foreground">Dalee_lashes</strong>, votre destination
              d'exception pour des extensions de cils sur-mesure. Dans notre
              salon intimiste au cœur de Paris, nous combinons expertise
              technique et attention aux détails pour sublimer votre beauté
              naturelle.
            </p>
            <p className="text-body mb-10">
              Chaque prestation est une expérience unique, réalisée avec passion
              et les meilleurs produits du marché. Notre mission : révéler
              l'éclat de votre regard tout en préservant la santé de vos cils
              naturels.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Location */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 mb-8">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm">
                Trois-rivières
                Canada
              </span>
              <a
                href="tel:+1 (873) 255-7383"
                className="flex items-center gap-2 text-sm text-primary hover:underline ml-auto"
              >
                <Phone className="w-4 h-4" />
                +1 (873) 255-7383
              </a>
            </div>

            <Link to="/a-propos">
              <Button variant="luxury-outline" size="lg">
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
