import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const faqItems = [
  {
    category: "Avant le rendez-vous",
    questions: [
      {
        q: "Comment me préparer avant ma pose d'extensions ?",
        a: "Venez démaquillée, sans mascara ni résidus de maquillage sur les cils. Évitez les produits huileux sur le contour des yeux 24h avant. Si vous portez des lentilles, pensez à les retirer ou à apporter vos lunettes car vos yeux seront fermés pendant la prestation.",
      },
      {
        q: "Puis-je venir avec du mascara ?",
        a: "Non, il est important de venir avec les cils propres et sans mascara. Les résidus de maquillage peuvent empêcher une bonne adhésion des extensions et réduire leur durée de vie.",
      },
      {
        q: "Combien de temps dure une pose complète ?",
        a: "La durée varie selon le type de prestation : environ 1h30 pour une extension classique, 2h pour une hybride, 2h30 pour un volume russe et jusqu'à 3h pour un mega volume. Prévoyez du temps pour ne pas être pressée.",
      },
    ],
  },
  {
    category: "Pendant la prestation",
    questions: [
      {
        q: "Est-ce douloureux ?",
        a: "Absolument pas ! La pose est totalement indolore. La plupart de nos clientes s'endorment pendant la prestation car c'est un moment très relaxant. Vous êtes confortablement installée et vos yeux restent fermés.",
      },
      {
        q: "Puis-je choisir la longueur et le style ?",
        a: "Bien sûr ! Nous réalisons toujours une consultation avant chaque pose pour comprendre vos envies et vous conseiller le style le plus adapté à la forme de vos yeux et à votre style de vie.",
      },
    ],
  },
  {
    category: "Entretien",
    questions: [
      {
        q: "Combien de temps durent les extensions ?",
        a: "Les extensions suivent le cycle naturel de vos cils et tombent progressivement avec eux. En moyenne, une pose complète dure 3 à 4 semaines avec un entretien adapté. Nous recommandons un remplissage toutes les 2 à 3 semaines pour maintenir un résultat optimal.",
      },
      {
        q: "Comment entretenir mes extensions ?",
        a: "Évitez l'eau sur les cils pendant les 24-48h suivant la pose. Brossez-les délicatement chaque jour avec la brosse fournie. Évitez les produits huileux sur le contour des yeux et ne frottez pas vos yeux.",
      },
      {
        q: "Puis-je porter du mascara ?",
        a: "Nous vous le déconseillons car le mascara peut endommager les extensions et réduire leur durée. Si vraiment nécessaire, utilisez uniquement un mascara spécial extensions (sans huile) et uniquement sur les pointes.",
      },
      {
        q: "Puis-je aller à la piscine ou au sauna ?",
        a: "Attendez 48h après la pose avant de vous exposer à l'humidité intense. Ensuite, c'est possible mais évitez de frotter vos yeux. L'eau chlorée et la chaleur peuvent réduire la durée de vie des extensions.",
      },
    ],
  },
  {
    category: "Remplissages",
    questions: [
      {
        q: "Quand dois-je revenir pour un remplissage ?",
        a: "Nous recommandons un remplissage toutes les 2 à 3 semaines pour maintenir un regard parfait. Si vous attendez plus de 4 semaines, une nouvelle pose complète sera nécessaire.",
      },
      {
        q: "Combien de temps dure un remplissage ?",
        a: "Un remplissage dure généralement entre 45 minutes et 1h30 selon le type d'extensions et le nombre de cils à remplacer.",
      },
    ],
  },
  {
    category: "Annulation & Paiement",
    questions: [
      {
        q: "Quelle est votre politique d'annulation ?",
        a: "L'annulation est gratuite jusqu'à 24h avant le rendez-vous. En cas d'annulation tardive (moins de 24h) ou de non-présentation, un montant équivalent à 50% de la prestation pourra être demandé.",
      },
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons les paiements par carte bancaire, espèces et cartes cadeaux. Le paiement s'effectue à la fin de la prestation.",
      },
    ],
  },
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h1 className="heading-display mb-6">
              Questions
              <br />
              <span className="text-gradient-luxury">fréquentes</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes sur nos
              prestations et l'entretien de vos extensions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding pt-8">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqItems.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, qIndex) => {
                    const itemId = `${catIndex}-${qIndex}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <div
                        key={itemId}
                        className="bg-card rounded-xl border border-border/50 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-muted-foreground">
                            {item.a}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
