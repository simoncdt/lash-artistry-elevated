import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, ChevronLeft, Check, User, Phone, Mail, CreditCard, Info } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const services = [
  {
    id: "classique",
    name: "Extension Classique",
    description: "Naturel & élégant",
    price: 80,
    duration: "1h30",
  },
  {
    id: "hybride",
    name: "Extension Hybride",
    description: "L'équilibre parfait",
    price: 100,
    duration: "2h",
  },
  {
    id: "volume",
    name: "Volume Russe",
    description: "Intense & glamour",
    price: 120,
    duration: "2h30",
  },
  {
    id: "mega-volume",
    name: "Mega Volume",
    description: "Drama & impact",
    price: 150,
    duration: "3h",
  },
  {
    id: "remplissage-2s",
    name: "Remplissage 2 semaines",
    description: "Entretien régulier",
    price: 55,
    duration: "1h",
  },
  {
    id: "remplissage-3s",
    name: "Remplissage 3 semaines",
    description: "Entretien standard",
    price: 65,
    duration: "1h15",
  },
];

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Date & Heure" },
  { id: 3, name: "Informations" },
  { id: 4, name: "Confirmation" },
];

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getSelectedServiceData = () =>
    services.find((s) => s.id === selectedService);

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        days.push(date);
      }
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wider mb-4">
              <Calendar className="w-4 h-4" />
              Réservation
            </span>
            <h1 className="heading-display mb-4">
              Réservez votre
              <br />
              <span className="text-gradient-luxury">rendez-vous</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-y border-border">
        <div className="container-luxury">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-12 h-0.5 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Steps Content */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="heading-section text-center mb-8">
                  Choisissez votre prestation
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-lg font-semibold text-primary">
                          {service.price}€
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <Button
                    variant="luxury"
                    size="lg"
                    onClick={nextStep}
                    disabled={!selectedService}
                  >
                    Continuer
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="heading-section text-center mb-8">
                  Choisissez la date et l'heure
                </h2>

                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Date</h3>
                  <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {generateCalendarDays().map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 text-center transition-all ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {formatDate(date)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Heure</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-3 rounded-xl border-2 text-center transition-all ${
                          selectedTime === time
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-sm font-medium">{time}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="ghost" size="lg" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </Button>
                  <Button
                    variant="luxury"
                    size="lg"
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continuer
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="heading-section text-center mb-8">
                  Vos informations
                </h2>

                <div className="max-w-xl mx-auto space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Prénom *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Votre prénom"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom *
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Votre nom"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="votre@email.com"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Téléphone *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+33 6 00 00 00 00"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="ghost" size="lg" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </Button>
                  <Button
                    variant="luxury"
                    size="lg"
                    onClick={nextStep}
                    disabled={
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email ||
                      !formData.phone
                    }
                  >
                    Continuer
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="heading-section text-center mb-8">
                  Confirmez votre réservation
                </h2>

                <div className="max-w-xl mx-auto">
                  {/* Summary Card */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50 mb-8">
                    <h3 className="font-semibold text-lg mb-6">Récapitulatif</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">
                          Prestation
                        </span>
                        <span className="font-medium">
                          {getSelectedServiceData()?.name}
                        </span>
                      </div>
                      <div className="flex justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {selectedDate?.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">Heure</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between pb-4 border-b border-border">
                        <span className="text-muted-foreground">Durée</span>
                        <span className="font-medium">
                          {getSelectedServiceData()?.duration}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-semibold text-lg text-primary">
                          {getSelectedServiceData()?.price}€
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Policies */}
                  <div className="bg-muted/50 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-2">
                          <strong className="text-foreground">
                            Politique d'annulation :
                          </strong>{" "}
                          Annulation gratuite jusqu'à 24h avant le rendez-vous.
                        </p>
                        <p>
                          Un email de confirmation vous sera envoyé à{" "}
                          <strong className="text-foreground">
                            {formData.email}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" onClick={prevStep}>
                      <ChevronLeft className="w-4 h-4" />
                      Retour
                    </Button>
                    <Button variant="luxury" size="lg">
                      <CreditCard className="w-4 h-4" />
                      Confirmer la réservation
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
