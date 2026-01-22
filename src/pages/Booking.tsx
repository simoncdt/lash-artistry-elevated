import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Phone,
  Mail,
  CreditCard,
  Info,
  Loader2,
  Upload,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startOfDay, endOfDay } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

// Configuration
const SALON_TIMEZONE = "America/Toronto";
const BACKEND_URL = "http://localhost:5000"; // À changer en production

const services = [
  {
    id: "classique",
    name: "Extension Classique",
    description: "Naturel & élégant",
    price: 60,
    duration: "2h30",
    durationMinutes: 150,
  },
  {
    id: "hybride",
    name: "Extension Hybride",
    description: "L'équilibre parfait",
    price: 70,
    duration: "2h",
    durationMinutes: 120,
  },
  {
    id: "volume",
    name: "Volume",
    description: "Intense & glamour",
    price: 80,
    duration: "2h30",
    durationMinutes: 150,
  },
  {
    id: "remplissage-2s",
    name: "Remplissage classique",
    description: "Entretien régulier",
    price: 30,
    duration: "2h30",
    durationMinutes: 150,
  },
  {
    id: "remplissage-3s",
    name: "Remplissage hybride",
    description: "Entretien standard",
    price: 35,
    duration: "2h30",
    durationMinutes: 150,
  },
  {
    id: "remplissage-4s",
    name: "Remplissage volume",
    description: "Entretien avancé",
    price: 40,
    duration: "2h30",
    durationMinutes: 150,
  },
];

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Date & Heure" },
  { id: 3, name: "Informations" },
  { id: 4, name: "Paiement & Confirmation" },
];

// Composant Calendrier (inchangé)
interface CalendarComponentProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const CalendarComponent = ({ selectedDate, onSelectDate }: CalendarComponentProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const isPrevMonthDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            disabled={isPrevMonthDisabled}
            className={`p-2 rounded-lg border transition-colors ${
              isPrevMonthDisabled
                ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                : "border-border hover:border-primary hover:text-primary"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;
          const disabled = isPast(date);
          const selected = isSelected(date);
          const todayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => !disabled && onSelectDate(date)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${disabled
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "hover:border-primary hover:bg-primary/5"}
                ${selected
                  ? "bg-primary text-primary-foreground border-2 border-primary"
                  : "border border-border"}
                ${todayDate && !selected ? "border-primary border-2" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  // États pour paiement / preuve / création
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getSelectedServiceData = () => services.find((s) => s.id === selectedService);

  // Chargement créneaux
  useEffect(() => {
    if (currentStep !== 2 || !selectedDate || !selectedService) {
      setAvailableSlots([]);
      setSlotsError(null);
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      setAvailableSlots([]);

      try {
        const localStartOfDay = startOfDay(selectedDate);
        const localEndOfDay = endOfDay(selectedDate);
        const startUTC = toZonedTime(localStartOfDay, SALON_TIMEZONE);

        const url = `${BACKEND_URL}/api/availability?date=${encodeURIComponent(
          startUTC.toISOString()
        )}&serviceId=${encodeURIComponent(selectedService)}`;

        const response = await fetch(url);

        if (!response.ok) throw new Error(`Erreur ${response.status}`);

        const data = await response.json();

        if (Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
        } else {
          setSlotsError("Format de réponse invalide");
        }
      } catch (err) {
        setSlotsError("Impossible de charger les créneaux (serveur inaccessible ?)");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [currentStep, selectedDate, selectedService]);

  // Organisation créneaux par période
  const organizeSlotsByPeriod = (slots: string[]) => {
    const periods = {
      morning: { label: "Matin (9h - 12h)", slots: [] as string[] },
      midday: { label: "Midi (12h - 15h)", slots: [] as string[] },
      afternoon: { label: "Après-midi (15h - 18h)", slots: [] as string[] },
      evening: { label: "Soirée (18h - 21h)", slots: [] as string[] },
    };

    slots.forEach((slot) => {
      const hour = parseInt(slot.split(":")[0], 10);
      if (hour >= 9 && hour < 12) periods.morning.slots.push(slot);
      else if (hour >= 12 && hour < 15) periods.midday.slots.push(slot);
      else if (hour >= 15 && hour < 18) periods.afternoon.slots.push(slot);
      else if (hour >= 18 && hour <= 21) periods.evening.slots.push(slot);
    });

    return periods;
  };

  const organizedSlots = organizeSlotsByPeriod(availableSlots);

  // Soumission finale : création réservation + preuve
  const handleFinalSubmit = async () => {
    if (!paymentProof || !selectedService || !selectedDate || !selectedTime) {
      alert("Informations incomplètes");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();

      // 1. Réservation
      formDataToSend.append("serviceId", selectedService);
      formDataToSend.append(
        "startTime",
        toZonedTime(
          new Date(
            selectedDate.setHours(
              parseInt(selectedTime.split(":")[0]),
              parseInt(selectedTime.split(":")[1])
            )
          ),
          SALON_TIMEZONE
        ).toISOString()
      );

      // 2. Infos client
      formDataToSend.append("firstName", formData.firstName.trim());
      formDataToSend.append("lastName", formData.lastName.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phone", formData.phone.trim());
      formDataToSend.append("notes", formData.notes?.trim() || "");

      // 3. Preuve paiement
      formDataToSend.append("proof", paymentProof);

      const response = await fetch(`${BACKEND_URL}/api/bookings/submit-with-proof`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Erreur lors de la soumission");
      }

      setReservationSubmitted(true);

      alert(
        "Réservation créée avec succès !\n\n" +
        "Votre acompte de 50% a été enregistré.\n" +
        "La réservation est en attente de validation.\n" +
        "L'adresse exacte du rendez-vous vous sera envoyée par email sous 24h maximum."
      );
    } catch (err: any) {
      alert("Erreur : " + (err.message || "Problème lors de la confirmation"));
      console.error("Erreur soumission finale :", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
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

      {/* Steps */}
      <section className="py-8 border-y border-border">
        <div className="container-luxury">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
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
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{step.name}</span>
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

      {/* Contenu */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Service */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="heading-section text-center mb-8">Choisissez votre prestation</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        selectedService === service.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-lg font-semibold text-primary">${service.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-8">
                  <Button variant="luxury" size="lg" onClick={nextStep} disabled={!selectedService}>
                    Continuer <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Heure */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="heading-section text-center mb-8">Choisissez la date et l'heure</h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  <CalendarComponent
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  />

                  <div>
                    <h3 className="font-semibold mb-4">
                      Horaires disponibles ({SALON_TIMEZONE.split("/")[1]})
                    </h3>

                    {!selectedDate ? (
                      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                        Sélectionnez une date dans le calendrier
                      </div>
                    ) : loadingSlots ? (
                      <div className="flex items-center justify-center py-12 text-muted-foreground">
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Chargement des créneaux...
                      </div>
                    ) : slotsError ? (
                      <div className="text-center py-10 text-destructive bg-destructive/5 rounded-xl p-6">
                        {slotsError}
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-xl">
                        Aucun créneau disponible pour cette date
                      </div>
                    ) : (
                      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                        {Object.entries(organizedSlots).map(([key, period]) =>
                          period.slots.length > 0 ? (
                            <div key={key}>
                              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                {period.label}
                              </h4>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {period.slots.map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-3 py-2.5 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                                      selectedTime === time
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="ghost" size="lg" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button variant="luxury" size="lg" onClick={nextStep} disabled={!selectedDate || !selectedTime}>
                    Continuer <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Informations */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="heading-section text-center mb-8">Vos informations</h2>

                <div className="max-w-xl mx-auto space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Prénom *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Votre prénom"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom *</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (XXX) XXX-XXXX"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optionnel)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Allergies, préférences, demandes spéciales..."
                      rows={3}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="ghost" size="lg" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    variant="luxury"
                    size="lg"
                    onClick={nextStep}
                    disabled={
                      !formData.firstName.trim() ||
                      !formData.lastName.trim() ||
                      !formData.email.trim() ||
                      !formData.phone.trim()
                    }
                  >
                    Continuer <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Étape 4 : Paiement & Confirmation */}
{currentStep === 4 && (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
    <h2 className="heading-section text-center mb-8">Paiement & Confirmation</h2>

    <div className="max-w-xl mx-auto space-y-8">
      {/* Récapitulatif */}
      <div className="bg-card rounded-2xl p-8 border border-border/50">
        <h3 className="font-semibold text-lg mb-6">Récapitulatif</h3>
        <div className="space-y-4">
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Prestation</span>
            <span className="font-medium">{getSelectedServiceData()?.name}</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Heure</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Durée</span>
            <span className="font-medium">{getSelectedServiceData()?.duration}</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t">
            <span className="font-semibold">Prix total</span>
            <span className="font-bold text-primary">
              ${getSelectedServiceData()?.price}
            </span>
          </div>
          <div className="flex justify-between text-lg pt-3">
            <span className="font-semibold text-rose-600">Acompte requis</span>
            <span className="font-bold text-rose-600">
              25 $
            </span>
          </div>
        </div>
      </div>

      {!reservationSubmitted ? (
        <>
          {/* Instructions paiement */}
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Acompte unique de 25 $ requis
            </h3>
            <p className="mb-4">
              Envoyez <strong>25 $</strong> par Interac e-Transfer à :
            </p>
            <div className="bg-background p-4 rounded border font-mono text-center mb-4">
              votre.interac@email.com   {/* ← CHANGE ÇA */}
            </div>
            <p className="text-sm">
              Question : "Date du RDV"  
              Réponse : {selectedDate?.toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Upload preuve */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && setPaymentProof(e.target.files[0])}
              className="hidden"
              id="proof-upload"
            />
            <label htmlFor="proof-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium text-lg">Téléversez votre preuve Interac</p>
              <p className="text-sm text-muted-foreground mt-2">
                Capture d'écran du virement de 25 $ (JPG/PNG – max 5 Mo)
              </p>
            </label>

            {paymentProof && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="font-medium">Preuve sélectionnée :</p>
                <p className="text-sm text-muted-foreground break-all">{paymentProof.name}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" size="lg" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <Button
              variant="luxury"
              size="lg"
              disabled={!paymentProof || uploading}
              onClick={handleFinalSubmit}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Soumettre la preuve & Confirmer"
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-green-50/50 rounded-2xl border border-green-200">
          <Check className="w-16 h-16 mx-auto text-green-600 mb-6" />
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            Réservation enregistrée !
          </h3>
          <p className="text-lg mb-6">
            Votre acompte unique de 25 $ est bien reçu.
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            La réservation est en attente de validation manuelle.<br />
            L'adresse exacte du rendez-vous vous sera envoyée par email sous 24h maximum.
          </p>
          <p className="text-sm text-muted-foreground">
            Confirmation envoyée à : <strong>{formData.email}</strong>
          </p>
        </div>
      )}
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