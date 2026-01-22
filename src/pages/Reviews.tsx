import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageCircle, Send, Loader2, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = "http://localhost:5000"; // À changer en prod

// ← AJOUT DU TABLEAU SERVICES ICI (exactement le même que dans Booking.tsx)
const services = [
  {
    id: "classique",
    name: "Extension Classique",
  },
  {
    id: "hybride",
    name: "Extension Hybride",
  },
  {
    id: "volume",
    name: "Volume Russe",
  },
  {
    id: "mega-volume",
    name: "Mega Volume",
  },
  {
    id: "remplissage-2s",
    name: "Remplissage 2 semaines",
  },
  {
    id: "remplissage-3s",
    name: "Remplissage 3 semaines",
  },
];

interface ReviewType {
  _id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    rating: 5,
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Charger les avis approuvés
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reviews`);
        const data = await response.json();

        if (data.success) {
          const formattedReviews = data.reviews.map((r: any) => ({
            ...r,
            date: new Date(r.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          }));
          setReviews(formattedReviews);
        }
      } catch (err) {
        console.error("Erreur chargement avis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Trier les avis
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // récent par défaut
  });

  // Calculer la moyenne et la répartition
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  // Soumettre un avis
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.service || !formData.text.trim()) {
      setSubmitError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la soumission");
      }

      setSubmitSuccess(true);
      setFormData({ name: "", service: "", rating: 5, text: "" });
    } catch (err: any) {
      setSubmitError(err.message || "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
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
            <h1 className="heading-display mb-6">Avis Clients</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos clientes pensent de leur expérience chez Dalee_lashes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-12 border-y border-border">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <span className="text-6xl font-display font-semibold">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(averageRating) ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">Basé sur {reviews.length} avis</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm w-8">{item.stars} ★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formulaire laisser un avis */}
      <section className="py-12 border-b border-border">
        <div className="container-luxury max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Laisser votre avis</h2>

            {submitSuccess ? (
              <div className="text-center py-8">
                <Check className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-green-700 mb-2">Merci pour votre avis !</h3>
                <p className="text-muted-foreground">
                  Votre commentaire a été soumis avec succès.<br />
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Votre prénom</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sophie"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prestation réalisée</label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez votre prestation" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre note</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre commentaire</label>
                  <Textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Votre expérience chez nous..."
                    rows={5}
                    required
                  />
                </div>

                {submitError && <p className="text-destructive text-sm">{submitError}</p>}

                <Button type="submit" variant="luxury" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer mon avis
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Liste des avis */}
      <section className="section-padding">
        <div className="container-luxury">
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

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun avis pour le moment
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 md:p-8 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i + review.rating} className="w-4 h-4 text-muted-foreground" />
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;