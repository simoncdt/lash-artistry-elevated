import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Sparkles, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import classicImage from "@/assets/lashes-classic.jpg";
import hybridImage from "@/assets/lashes-hybrid.jpg";
import volumeImage from "@/assets/lashes-volume.jpg";
import megaVolumeImage from "@/assets/lashes-megavolume.jpg";

const services = [
  {
    id: "classique",
    title: "Extension Classique",
    subtitle: "Naturel & Élégant",
    description:
      "La technique classique pose une extension sur chaque cil naturel. Idéale pour un premier essai ou pour celles qui recherchent un effet naturel et raffiné qui sublime le regard sans excès.",
    image: classicImage,
    duration: "1h30",
    includes: [
      "Consultation personnalisée",
      "Nettoyage des cils",
      "Pose complète",
      "Conseils d'entretien",
    ],
    pricing: [
      { name: "Pose complète", price: "80€", duration: "1h30" },
      { name: "Remplissage 2 semaines", price: "45€", duration: "45min" },
      { name: "Remplissage 3 semaines", price: "55€", duration: "1h" },
    ],
  },
  {
    id: "hybride",
    title: "Extension Hybride",
    subtitle: "L'équilibre parfait",
    description:
      "Le parfait compromis entre classique et volume. Ce mix harmonieux associe extensions simples et bouquets légers pour un regard intensifié tout en conservant un aspect naturel.",
    image: hybridImage,
    duration: "2h",
    includes: [
      "Consultation personnalisée",
      "Nettoyage des cils",
      "Pose mixte classique/volume",
      "Conseils d'entretien",
    ],
    pricing: [
      { name: "Pose complète", price: "100€", duration: "2h" },
      { name: "Remplissage 2 semaines", price: "55€", duration: "1h" },
      { name: "Remplissage 3 semaines", price: "65€", duration: "1h15" },
    ],
  },
  {
    id: "volume",
    title: "Volume Russe",
    subtitle: "Intense & Glamour",
    description:
      "La technique Volume Russe crée des bouquets de 2 à 6 extensions ultra-fines sur chaque cil naturel. Le résultat : un regard intense et glamour avec un effet volume spectaculaire.",
    image: volumeImage,
    duration: "2h30",
    includes: [
      "Consultation personnalisée",
      "Nettoyage des cils",
      "Pose volume complète",
      "Conseils d'entretien personnalisés",
    ],
    pricing: [
      { name: "Pose complète", price: "120€", duration: "2h30" },
      { name: "Remplissage 2 semaines", price: "65€", duration: "1h15" },
      { name: "Remplissage 3 semaines", price: "75€", duration: "1h30" },
    ],
  },
  {
    id: "mega-volume",
    title: "Mega Volume",
    subtitle: "Drama & Impact",
    description:
      "Le summum du volume et de l'intensité. Des bouquets de 10+ extensions ultra-légères créent un regard de star, parfait pour les occasions spéciales ou pour celles qui aiment les looks audacieux.",
    image: megaVolumeImage,
    duration: "3h",
    includes: [
      "Consultation approfondie",
      "Nettoyage des cils",
      "Pose mega volume",
      "Kit d'entretien offert",
      "Conseils d'entretien VIP",
    ],
    pricing: [
      { name: "Pose complète", price: "150€", duration: "3h" },
      { name: "Remplissage 2 semaines", price: "80€", duration: "1h30" },
      { name: "Remplissage 3 semaines", price: "95€", duration: "1h45" },
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              Nos Services
            </span>
            <h1 className="heading-display mb-6">
              Des prestations
              <br />
              <span className="text-gradient-luxury">sur-mesure</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre gamme complète d'extensions de cils, des plus
              naturelles aux plus spectaculaires. Chaque technique est adaptée
              à vos envies et à la morphologie de votre regard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding pt-0">
        <div className="container-luxury">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="scroll-mt-24"
              >
                <div
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div className="relative rounded-2xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full aspect-[4/5] object-cover"
                      />
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full glass border border-border/50">
                        <span className="text-sm font-medium">
                          À partir de {service.pricing[0].price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">
                      {service.subtitle}
                    </span>
                    <h2 className="heading-section mt-2 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-body mb-8">{service.description}</p>

                    {/* Duration */}
                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                      <Clock className="w-5 h-5" />
                      <span>Durée: {service.duration}</span>
                    </div>

                    {/* Includes */}
                    <div className="mb-8">
                      <h4 className="font-semibold mb-4">Ce qui est inclus :</h4>
                      <ul className="space-y-2">
                        {service.includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 text-muted-foreground"
                          >
                            <Check className="w-5 h-5 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing Table */}
                    <div className="bg-muted/50 rounded-xl p-6 mb-8">
                      <h4 className="font-semibold mb-4">Tarifs</h4>
                      <div className="space-y-3">
                        {service.pricing.map((price) => (
                          <div
                            key={price.name}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{price.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {price.duration}
                              </p>
                            </div>
                            <p className="text-lg font-semibold text-primary">
                              {price.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to="/reservation">
                      <Button variant="luxury" size="lg" className="group">
                        Réserver cette prestation
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
