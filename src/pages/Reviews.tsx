import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Sophie M.",
    service: "Volume Russe",
    rating: 5,
    text: "Une expérience absolument incroyable ! Dalee a su comprendre exactement ce que je voulais. Le résultat est magnifique, naturel et tellement élégant. Je recommande à 100% !",
    date: "15 décembre 2025",
    helpful: 24,
  },
  {
    id: 2,
    name: "Marie L.",
    service: "Extension Classique",
    rating: 5,
    text: "Professionnalisme au top ! L'ambiance est zen, le salon est magnifique et les extensions sont parfaites. C'est ma nouvelle adresse beauté préférée.",
    date: "10 décembre 2025",
    helpful: 18,
  },
  {
    id: 3,
    name: "Camille R.",
    service: "Mega Volume",
    rating: 5,
    text: "Je suis cliente fidèle depuis 2 ans et je ne changerais pour rien au monde. Chaque rendez-vous est un moment de détente et le résultat est toujours à la hauteur de mes attentes.",
    date: "5 décembre 2025",
    helpful: 32,
  },
  {
    id: 4,
    name: "Léa B.",
    service: "Hybride",
    rating: 5,
    text: "Première fois que je tente les extensions et je suis conquise ! Dalee m'a parfaitement conseillée et le résultat est sublime. Je me sens tellement belle !",
    date: "1 décembre 2025",
    helpful: 15,
  },
  {
    id: 5,
    name: "Emma V.",
    service: "Volume Russe",
    rating: 5,
    text: "Un talent incroyable ! Les extensions tiennent parfaitement et le rendu est juste magnifique. Merci pour cette transformation !",
    date: "28 novembre 2025",
    helpful: 21,
  },
  {
    id: 6,
    name: "Julie P.",
    service: "Extension Classique",
    rating: 4,
    text: "Très satisfaite de ma première expérience. Le salon est agréable, le travail est soigné. J'ai hâte d'y retourner pour mon remplissage !",
    date: "25 novembre 2025",
    helpful: 12,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 108, percentage: 90 },
  { stars: 4, count: 10, percentage: 8 },
  { stars: 3, count: 2, percentage: 2 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
];

const Reviews = () => {
  const [sortBy, setSortBy] = useState("recent");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    return 0;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              Témoignages
            </span>
            <h1 className="heading-display mb-6">
              Avis Clients
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos clientes pensent de leur expérience chez
              Dalee_lashes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-12 border-y border-border">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Overall Rating */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="text-6xl font-display font-semibold">4.9</span>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    Basé sur 120 avis
                  </span>
                </div>
              </div>
              <Button variant="luxury" className="mt-4">
                <MessageCircle className="w-4 h-4" />
                Laisser un avis
              </Button>
            </motion.div>

            {/* Rating Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm w-8">{item.stars} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="section-padding">
        <div className="container-luxury">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Tous les avis</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-muted border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="recent">Plus récents</option>
                <option value="helpful">Plus utiles</option>
              </select>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid gap-6">
            {sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-border/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.service} • {review.date}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">"{review.text}"</p>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Utile ({review.helpful})
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;
