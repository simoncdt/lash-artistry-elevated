import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Award, Heart, Shield, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import salonImage from "@/assets/salon-interior.jpg";

const stats = [
  { value: "500+", label: "Clientes satisfaites" },
  { value: "5 ans", label: "D'expertise" },
  { value: "4.9", label: "Note moyenne" },
  { value: "100%", label: "Produits premium" },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "Nous visons l'excellence dans chaque détail, de l'accueil à la réalisation.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Notre passion pour la beauté se reflète dans chacune de nos prestations.",
  },
  {
    icon: Shield,
    title: "Confiance",
    description:
      "Votre confiance est notre priorité, nous utilisons uniquement des produits premium.",
  },
  {
    icon: Users,
    title: "Écoute",
    description:
      "Chaque cliente est unique, nous adaptons nos conseils à vos besoins.",
  },
];

const About = () => {
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
              Notre Histoire
            </span>
            <h1 className="heading-display mb-6">
              L'art de sublimer
              <br />
              <span className="text-gradient-luxury">chaque regard</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Depuis 5 ans, Dalee_lashes accompagne les femmes dans leur quête de
              beauté avec expertise, passion et un sens aigu du détail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-section mb-6">Notre vision</h2>
              <div className="space-y-4 text-body">
                <p>
                  Chez <strong className="text-foreground">Dalee_lashes</strong>, nous croyons que
                  chaque femme mérite de se sentir belle et confiante. C'est
                  avec cette conviction que notre salon a vu le jour au cœur de
                  Paris.
                </p>
                <p>
                  Notre approche repose sur l'écoute attentive de vos envies et
                  la maîtrise parfaite des techniques les plus avancées. Chaque
                  prestation est personnalisée pour mettre en valeur votre
                  beauté naturelle.
                </p>
                <p>
                  Nous sélectionnons rigoureusement nos produits parmi les
                  meilleures marques professionnelles pour garantir un résultat
                  optimal et préserver la santé de vos cils naturels.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={salonImage}
                  alt="Salon Dalee_lashes"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="heading-section mb-4">Nos valeurs</h2>
            <p className="text-body">
              Les principes qui guident chacune de nos actions et font de votre
              expérience un moment d'exception.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border/50 card-luxury text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="heading-card mb-3">{value.title}</h3>
                <p className="text-body-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="heading-section mb-4">Nous trouver</h2>
            <p className="text-body">
              Notre salon vous accueille dans un cadre élégant et apaisant.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 border border-border/50"
            >
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Adresse</h3>
              <p className="text-muted-foreground">
                123 Avenue de la Beauté
                <br />
                75008 Paris, France
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border/50"
            >
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Horaires</h3>
              <div className="text-muted-foreground space-y-1">
                <p>Lundi - Samedi: 9h - 19h</p>
                <p>Dimanche: Fermé</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-border/50"
            >
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Contact</h3>
              <div className="text-muted-foreground space-y-1">
                <p>
                  <a href="tel:+33600000000" className="hover:text-primary transition-colors">
                    +33 6 00 00 00 00
                  </a>
                </p>
                <p>
                  <a href="mailto:contact@daleelashes.com" className="hover:text-primary transition-colors">
                    contact@daleelashes.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 rounded-2xl overflow-hidden bg-muted aspect-[21/9] flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground">
                Carte Google Maps
                <br />
                <span className="text-sm">
                  (Intégration disponible avec une clé API)
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
