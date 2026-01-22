import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import classicImage from "@/assets/class.jpeg";
import hybridImage from "@/assets/hyb.jpeg";
import volumeImage from "@/assets/Vol.jpeg";
import megaVolumeImage from "@/assets/megavol.jpeg";

const services = [
  {
    id: "classique",
    title: "Classique",
    subtitle: "Naturel & Élégant",
    description:
      "Une extension par cil naturel pour un résultat subtil et sophistiqué.",
    duration: "1h30",
    price: "À partir de 80€",
    image: classicImage,
  },
  {
    id: "hybride",
    title: "Hybride",
    subtitle: "L'équilibre parfait",
    description:
      "Mix de classique et volume pour un regard intensifié tout en naturel.",
    duration: "2h",
    price: "À partir de 100€",
    image: hybridImage,
  },
  {
    id: "volume",
    title: "Volume",
    subtitle: "Intense & Glamour",
    description:
      "Bouquets de 2 à 6 extensions ultra-fines pour un effet volume spectaculaire.",
    duration: "2h30",
    price: "À partir de 120€",
    image: volumeImage,
  },
];

export const ServicesSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            Nos Prestations
          </span>
          <h2 className="heading-section mb-4">
            Des extensions sur-mesure
            <br />
            pour chaque regard
          </h2>
          <p className="text-body">
            Découvrez notre gamme complète de services, conçue pour sublimer
            votre beauté naturelle avec des techniques de pointe et des produits
            premium.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/services#${service.id}`} className="group block">
                <div className="card-luxury bg-card rounded-2xl overflow-hidden border border-border/50">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full glass border border-border/50">
                      <span className="text-sm font-semibold text-foreground">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="heading-card text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {service.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>

                    <p className="text-body-sm mb-6">{service.description}</p>

                    <div className="flex items-center justify-between">
                      <Button variant="luxury" size="sm">
                        Réserver
                      </Button>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/services">
            <Button variant="luxury-outline" size="lg">
              Voir tous nos services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
