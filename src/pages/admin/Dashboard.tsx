"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  LogOut,
  Settings,
  Mail,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  Ban,
  Check,
  Download,
  AlertCircle,
  Search,
  PlusCircle,
  X,
  Star,
  Trash2,
  User,
  Bell,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const BACKEND_URL = "http://localhost:5000";

// ────────────────────────────────────────────────
// Interfaces (inchangées + nouvelles)
// ────────────────────────────────────────────────

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceSlug?: string;
  servicePrice: number;
  startTime: string;
  endTime: string;
  status: "pending" | "payment_proof_submitted" | "validated" | "completed" | "cancelled";
  notes?: string;
  paymentProof?: string;
  paymentAmountReceived?: number;
  createdAt: string;
  rejectionReason?: string;
  cancelledAt?: string;
}

interface Service {
  slug: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  active: boolean;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: string;
}

// Nouvelles interfaces
interface BlockedAvailability {
  _id: string;
  date: string;
  reason?: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

interface Review {
  text: string;
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "pending" | "published" | "rejected";
  createdAt: string;
}

// ────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "services" | "contacts" | "availability" | "reviews" | "settings"
  >("overview");

  const [token] = useState<string | null>(localStorage.getItem("adminToken"));

  // ─── States existants ───
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [newService, setNewService] = useState<Partial<Service>>({ active: true });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  // ─── Nouveaux states ───
  const [blockedAvailabilities, setBlockedAvailabilities] = useState<BlockedAvailability[]>([]);
  const [availLoading, setAvailLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsStats, setReviewsStats] = useState({
    average: 0,
    total: 0,
    byStars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    fetchBookings();
    if (activeTab === "services") fetchServices();
    if (activeTab === "contacts") fetchContacts();
    if (activeTab === "availability") fetchBlockedAvailabilities();
    if (activeTab === "reviews") fetchReviews();
  }, [token, activeTab]);

  // ─── Fetch functions existantes ───────────────────────────────────────

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setBookingsError(err.message);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/services?includeInactive=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setServices(data.services || []);
    } catch {
      // silent
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContacts(data.messages || []);
    } catch {
      // silent
    } finally {
      setContactsLoading(false);
    }
  };

  // ─── Nouveaux fetch ───────────────────────────────────────────────────

  const fetchBlockedAvailabilities = async () => {
    setAvailLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/availability/blocked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBlockedAvailabilities(data.blocked || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAvailLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setReviews(data.reviews || []);

      // Calcul stats
      const total = data.reviews.length;
      const sum = data.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
      const byStars = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.reviews.forEach((r: Review) => byStars[r.rating]++);
      setReviewsStats({
        average: total > 0 ? sum / total : 0,
        total,
        byStars,
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // ─── Booking Actions (inchangées) ─────────────────────────────────────

  const handleBookingAction = async (
    bookingId: string,
    newStatus: Booking["status"],
    extraData: Record<string, any> = {}
  ) => {
    let confirmMessage = `Confirmer le passage au statut "${newStatus}" ?`;

    const current = bookings.find((b) => b._id === bookingId);

    if (newStatus === "cancelled") {
      if (current?.status === "validated") {
        confirmMessage = "⚠️ ANNULER une réservation DÉJÀ VALIDÉE ?\nCette action est irréversible.";
      } else if (current?.status === "completed") {
        confirmMessage = "⚠️ ANNULER une réservation TERMINÉE ?\nAction très exceptionnelle – confirmez-vous ?";
      }
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, ...extraData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Échec de l'action");
      }

      fetchBookings();
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = window.prompt("Raison du rejet (facultatif) :") || "";
    await handleBookingAction(bookingId, "cancelled", { rejectionReason: reason });
  };

  // ─── Service & Contact Actions (inchangées) ────────────────────────────

  const createOrUpdateService = async () => {
    if (!newService.name || !newService.price || !newService.duration || !newService.slug) {
      alert("Nom, prix, durée et slug sont obligatoires");
      return;
    }

    const method = editingService ? "PUT" : "POST";
    const url = editingService
      ? `${BACKEND_URL}/api/services/${editingService.slug}`
      : `${BACKEND_URL}/api/services`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      });

      if (!res.ok) throw new Error();

      setNewService({ active: true });
      setEditingService(null);
      fetchServices();
    } catch {
      alert("Erreur lors de la sauvegarde du service");
    }
  };

  const toggleServiceActive = async (slug: string, current: boolean) => {
    try {
      await fetch(`${BACKEND_URL}/api/services/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !current }),
      });
      fetchServices();
    } catch {
      alert("Impossible de modifier le statut");
    }
  };

  const startEditService = (svc: Service) => {
    setEditingService(svc);
    setNewService({ ...svc });
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/contacts/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch {
      alert("Erreur");
    }
  };

  // ─── Replacement Modal (inchangé) ─────────────────────────────────────

  const ReplacementModalContent = ({
    booking,
    onSuccess,
  }: {
    booking: Booking;
    onSuccess: () => void;
  }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [adminNote, setAdminNote] = useState("Remplacement suite annulation");

    const loadAvailableSlots = async () => {
      if (!booking.serviceSlug) return;

      setLoadingSlots(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/availability?date=${date}&serviceId=${booking.serviceSlug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les créneaux disponibles");
      } finally {
        setLoadingSlots(false);
      }
    };

    useEffect(() => {
      loadAvailableSlots();
    }, [date]);

    const createReplacement = async () => {
      if (!selectedSlot || !booking.serviceSlug) {
        alert("Veuillez sélectionner un créneau");
        return;
      }

      const startTime = `${date}T${selectedSlot}:00`;

      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/bookings/create-replacement`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            originalBookingId: booking._id,
            serviceSlug: booking.serviceSlug,
            startTime,
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            phone: booking.phone,
            notes: adminNote.trim() || "Remplacement suite annulation",
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Échec création");
        }

        alert("Nouveau rendez-vous créé et email envoyé au client !");
        onSuccess();
      } catch (err: any) {
        alert(`Erreur : ${err.message}`);
      }
    };

    return (
      <div className="space-y-6 py-4">
        <div>
          <Label>Date souhaitée</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400"
          />
        </div>

        <div>
          <Label>Créneaux disponibles {loadingSlots && "(chargement...)"}</Label>
          <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white/50 backdrop-blur-sm">
            {loadingSlots ? (
              <div className="text-center py-8 text-gray-500">Chargement des créneaux...</div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Aucun créneau disponible ce jour</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-2.5 px-4 border rounded-lg text-sm font-medium transition-all",
                      selectedSlot === slot
                        ? "bg-pink-600 text-white border-pink-700 shadow-sm"
                        : "border-gray-300 hover:bg-pink-50 hover:border-pink-300"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Note / message pour le client</Label>
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Ex : Nous vous proposons ce nouveau créneau suite à l'annulation précédente..."
            className="min-h-[100px] rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
              Annuler
            </Button>
          </DialogClose>
          <Button
            onClick={createReplacement}
            disabled={!selectedSlot || loadingSlots}
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
          >
            Confirmer & notifier le client
          </Button>
        </DialogFooter>
      </div>
    );
  };

  // ─── Computed ──────────────────────────────────────────────

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchText =
      searchText === "" ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      b.email.toLowerCase().includes(searchText.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchText;
  });

  const pending = bookings.filter((b) => b.status === "pending").length;
  const awaitingProof = bookings.filter((b) => b.status === "payment_proof_submitted").length;
  const validated = bookings.filter((b) => b.status === "validated").length;
  const totalRevenue = bookings
    .filter((b) => ["validated", "completed"].includes(b.status))
    .reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-sm hidden lg:flex lg:flex-col overflow-hidden">
        <div className="p-8 flex-shrink-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Dalee<span className="text-pink-600">Lashes</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-light">Espace Administration</p>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          {[
            { id: "overview", label: "Tableau de bord", icon: AlertCircle },
            { id: "bookings", label: "Réservations", icon: Calendar },
            { id: "availability", label: "Disponibilités", icon: Clock },
            { id: "reviews", label: "Avis & Témoignages", icon: Star },
            { id: "services", label: "Services", icon: Settings },
            { id: "contacts", label: "Messages", icon: Mail },
            { id: "settings", label: "Paramètres", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all duration-200",
                activeTab === tab.id
                  ? "bg-pink-50/80 text-pink-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-200 flex-shrink-0 bg-white/90 backdrop-blur-xl">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl"
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin");
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="lg:ml-72 min-h-screen p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {["Tableau de bord", "Réservations", "Disponibilités", "Avis & Témoignages", "Services", "Messages", "Paramètres"][
                ["overview", "bookings", "availability", "reviews", "services", "contacts", "settings"].indexOf(activeTab)
              ]}
            </h1>

            {activeTab === "services" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md rounded-xl">
                    <span className="mr-2 text-lg">+</span>
                    Nouveau service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingService ? "Modifier le service" : "Nouveau service"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-5 py-6">
                    <div>
                      <Label className="text-gray-700">Slug (identifiant URL)</Label>
                      <Input
                        value={newService.slug || ""}
                        onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                        placeholder="ex: extension-volume"
                        disabled={!!editingService}
                        className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400/30 mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Nom</Label>
                      <Input
                        value={newService.name || ""}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400/30 mt-1.5"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label className="text-gray-700">Prix (€)</Label>
                        <Input
                          type="number"
                          value={newService.price || ""}
                          onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                          className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400/30 mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Durée (min)</Label>
                        <Input
                          type="number"
                          value={newService.duration || ""}
                          onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                          className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400/30 mt-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Description</Label>
                      <Input
                        value={newService.description || ""}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="rounded-lg border-gray-300 focus:border-pink-400 focus:ring-pink-400/30 mt-1.5"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingService(null);
                        setNewService({ active: true });
                      }}
                      className="border-gray-300 hover:bg-gray-100 rounded-lg"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={createOrUpdateService}
                      className="bg-pink-600 hover:bg-pink-700 rounded-lg"
                    >
                      {editingService ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {activeTab === "availability" && (
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md rounded-xl">
                <PlusCircle className="h-5 w-5 mr-2" />
                Bloquer un créneau
              </Button>
            )}
          </div>

          {/* ─── OVERVIEW ──────────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">{pending}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Preuves à valider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">{awaitingProof}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Validées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">{validated}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">{totalRevenue.toFixed(2)} €</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── BOOKINGS ──────────────────────────────────────────────── */}
          {activeTab === "bookings" && (
            <>
              <div className="flex flex-col sm:flex-row gap-5 mb-10">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher client, email, service..."
                    className="pl-12 pr-4 py-6 rounded-2xl border-gray-200 focus:border-pink-400 focus:ring-pink-400/30 shadow-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[220px] py-6 rounded-2xl border-gray-200 shadow-sm focus:border-pink-400 focus:ring-pink-400/30">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="payment_proof_submitted">Preuve soumise</SelectItem>
                    <SelectItem value="validated">Validée</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bookingsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
                </div>
              ) : bookingsError ? (
                <div className="text-center py-20 text-red-600 bg-red-50/50 rounded-2xl border border-red-200">
                  {bookingsError}
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50/50 rounded-2xl border border-gray-200">
                  Aucune réservation ne correspond aux critères
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <Card
                      key={booking._id}
                      className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm"
                    >
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                          {/* Colonne infos */}
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4 flex-wrap">
                              <h3 className="text-2xl font-semibold text-gray-900">
                                {booking.firstName} {booking.lastName}
                              </h3>
                              <span
                                className={cn(
                                  "px-4 py-1.5 rounded-full text-xs font-medium shadow-sm",
                                  {
                                    pending: "bg-amber-100 text-amber-800",
                                    payment_proof_submitted: "bg-blue-100 text-blue-800",
                                    validated: "bg-emerald-100 text-emerald-800",
                                    completed: "bg-violet-100 text-violet-800",
                                    cancelled: "bg-rose-100 text-rose-800",
                                  }[booking.status]
                                )}
                              >
                                {{
                                  pending: "En attente paiement",
                                  payment_proof_submitted: "Preuve d'acompte soumise",
                                  validated: "Validée – acompte validé",
                                  completed: "Prestation terminée",
                                  cancelled: "Annulée",
                                }[booking.status]}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                              <div>
                                <div className="text-gray-500 mb-1">Service</div>
                                <div className="font-medium text-gray-800">{booking.serviceName}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Date & heure</div>
                                <div className="font-medium text-gray-800">
                                  {new Date(booking.startTime).toLocaleString("fr-FR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Montant total</div>
                                <div className="font-medium text-emerald-700">{booking.servicePrice} €</div>
                              </div>
                              {booking.paymentAmountReceived && (
                                <div>
                                  <div className="text-gray-500 mb-1">Acompte reçu</div>
                                  <div className="font-medium text-emerald-700">{booking.paymentAmountReceived} €</div>
                                </div>
                              )}
                              <div>
                                <div className="text-gray-500 mb-1">Créée le</div>
                                <div className="font-medium text-gray-600">
                                  {new Date(booking.createdAt).toLocaleString("fr-FR", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Preuve de paiement */}
                            {booking.paymentProof && (
                              <div className={`mt-6 p-5 rounded-2xl border shadow-sm ${
                                booking.status === "payment_proof_submitted"
                                  ? "bg-blue-50/70 border-blue-200"
                                  : "bg-gray-50/70 border-gray-200"
                              }`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                      <ImageIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">Preuve d'acompte soumise</div>
                                      {booking.paymentAmountReceived && (
                                        <div className="text-sm text-emerald-700">
                                          {booking.paymentAmountReceived} €
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-5">
                                    <button
                                      onClick={() => setSelectedProof(`${BACKEND_URL}${booking.paymentProof}`)}
                                      className="flex items-center gap-2 text-pink-600 hover:text-pink-800 text-sm font-medium transition-colors"
                                    >
                                      <Eye className="h-4 w-4" />
                                      Voir
                                    </button>

                                    <a
                                      href={`${BACKEND_URL}${booking.paymentProof}`}
                                      download={`preuve-acompte-${booking._id}-${booking.firstName}-${booking.lastName}.jpg`}
                                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                    >
                                      <Download className="h-4 w-4" />
                                      Télécharger
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Notes + Raison */}
                            {(booking.notes || booking.rejectionReason || booking.cancelledAt) && (
                              <div className="mt-6 space-y-4 text-sm">
                                {booking.notes && (
                                  <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200">
                                    <div className="font-medium text-gray-700 mb-2">Notes du client :</div>
                                    <div className="whitespace-pre-line text-gray-600 leading-relaxed">{booking.notes}</div>
                                  </div>
                                )}

                                {booking.rejectionReason && (
                                  <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-200">
                                    <div className="font-medium text-rose-700 mb-2">
                                      Raison du rejet / annulation :
                                    </div>
                                    <div className="text-rose-600">{booking.rejectionReason}</div>
                                  </div>
                                )}

                                {booking.cancelledAt && (
                                  <div className="text-xs text-gray-500 italic bg-gray-50/50 p-3 rounded-xl inline-block">
                                    Annulée le : {new Date(booking.cancelledAt).toLocaleString("fr-FR")}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 lg:flex-col lg:min-w-[240px] lg:gap-4">
                            {booking.status === "pending" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="rounded-xl bg-rose-600 hover:bg-rose-700 shadow-sm"
                                onClick={() => handleBookingAction(booking._id, "cancelled")}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Annuler
                              </Button>
                            )}

                            {booking.status === "payment_proof_submitted" && (
                              <div className="flex flex-wrap gap-3 lg:flex-col lg:gap-4">
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                                  onClick={() => handleBookingAction(booking._id, "validated")}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Valider acompte
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-rose-500 text-rose-600 hover:bg-rose-50 rounded-xl"
                                  onClick={() => handleReject(booking._id)}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Rejeter preuve
                                </Button>
                              </div>
                            )}

                            {booking.status === "validated" && (
                              <div className="flex flex-wrap gap-3 lg:flex-col lg:gap-4">
                                <Button
                                  size="sm"
                                  className="bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm"
                                  onClick={() => handleBookingAction(booking._id, "completed")}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Marquer terminé
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-rose-500 text-rose-600 hover:bg-rose-50 rounded-xl"
                                  onClick={() => handleBookingAction(booking._id, "cancelled")}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Annuler (exceptionnel)
                                </Button>
                              </div>
                            )}

                            {booking.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-rose-500 text-rose-600 hover:bg-rose-50 rounded-xl"
                                onClick={() => handleBookingAction(booking._id, "cancelled")}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Annuler (exceptionnel)
                              </Button>
                            )}

                            {booking.status === "cancelled" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-sm">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Proposer nouveau créneau
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
                                  <DialogHeader className="pb-6">
                                    <DialogTitle className="text-2xl font-semibold">
                                      Proposer un nouveau rendez-vous à {booking.firstName} {booking.lastName}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <ReplacementModalContent
                                    booking={booking}
                                    onSuccess={() => fetchBookings()}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── DISPONIBILITÉS ─────────────────────────────────────────────── */}
          {activeTab === "availability" && (
            <>
              {availLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
                </div>
              ) : blockedAvailabilities.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50/50 rounded-2xl border border-gray-200">
                  Aucune indisponibilité enregistrée
                </div>
              ) : (
                <div className="space-y-6">
                  {blockedAvailabilities.map((avail) => (
                    <Card
                      key={avail._id}
                      className="border-none shadow-md hover:shadow-lg transition-shadow rounded-2xl bg-white/90 backdrop-blur-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {new Date(avail.date).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {avail.allDay ? "Toute la journée" : `${avail.startTime} – ${avail.endTime}`}
                            </p>
                            {avail.reason && (
                              <p className="text-sm text-gray-500 mt-2 italic">{avail.reason}</p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => {
                              if (window.confirm("Supprimer cette indisponibilité ?")) {
                                // Appel API DELETE
                                fetch(`${BACKEND_URL}/api/admin/availability/blocked/${avail._id}`, {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` },
                                })
                                  .then((res) => {
                                    if (!res.ok) throw new Error("Erreur suppression");
                                    return res.json();
                                  })
                                  .then(() => {
                                    fetchBlockedAvailabilities();
                                    alert("Indisponibilité supprimée");
                                  })
                                  .catch((err) => alert("Erreur : " + err.message));
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── AVIS & TÉMOIGNAGES ────────────────────────────────────────── */}
{activeTab === "reviews" && (
  <>
    {reviewsLoading ? (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    ) : reviews.length === 0 ? (
      <div className="text-center py-20 text-gray-500 bg-gray-50/50 rounded-2xl border border-gray-200">
        Aucun avis pour le moment
      </div>
    ) : (
      <div className="space-y-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md rounded-2xl bg-white/90">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-pink-600">
                {reviewsStats.average.toFixed(1)}
              </div>
              <div className="mt-2 text-gray-600">Note moyenne</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md rounded-2xl bg-white/90">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-gray-900">
                {reviewsStats.total}
              </div>
              <div className="mt-2 text-gray-600">Avis total</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md rounded-2xl bg-white/90">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-yellow-600">
                {reviewsStats.byStars[5]} ★★★★★
              </div>
              <div className="mt-2 text-gray-600">5 étoiles</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des avis – texte en NOIR */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review._id} className="border-none shadow-md rounded-2xl bg-white/90">
              <CardContent className="p-8 space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-black">
                        {review.customerName}
                      </h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-5 w-5",
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Statut */}
                  {review.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                        onClick={() => {
                          fetch(`${BACKEND_URL}/api/admin/reviews/${review._id}/publish`, {
                            method: "PATCH",
                            headers: { Authorization: `Bearer ${token}` },
                          })
                            .then((res) => {
                              if (!res.ok) throw new Error("Erreur publication");
                              return res.json();
                            })
                            .then(() => {
                              fetchReviews();
                              alert("Avis publié avec succès");
                            })
                            .catch((err) => alert("Erreur : " + err.message));
                        }}
                      >
                        Publier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500 text-rose-600 hover:bg-rose-50 rounded-xl"
                        onClick={() => {
                          fetch(`${BACKEND_URL}/api/admin/reviews/${review._id}/reject`, {
                            method: "PATCH",
                            headers: { Authorization: `Bearer ${token}` },
                          })
                            .then((res) => {
                              if (!res.ok) throw new Error("Erreur rejet");
                              return res.json();
                            })
                            .then(() => {
                              fetchReviews();
                              alert("Avis rejeté");
                            })
                            .catch((err) => alert("Erreur : " + err.message));
                        }}
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {review.status !== "pending" && (
                    <span
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium",
                        review.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {review.status === "published" ? "Publié" : "Rejeté"}
                    </span>
                  )}
                </div>

                {/* Avis rédigé – texte en NOIR, très lisible */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <span className="text-base font-medium text-gray-900">
                      Avis rédigé par le client :
                    </span>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 prose prose-gray max-w-none">
                    <p className="text-black text-base leading-relaxed whitespace-pre-line break-words">
                      {review.text || "Aucun commentaire rédigé."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}
  </>
)}

          {/* ─── PARAMÈTRES ────────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <Card className="border-none shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <User className="h-6 w-6 text-pink-600" />
                    Profil Administrateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Nom complet</Label>
                      <Input defaultValue="Elfried Admin" className="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" defaultValue="admin@daleelashes.com" className="mt-1.5 rounded-xl" />
                    </div>
                  </div>
                  <Button className="bg-pink-600 hover:bg-pink-700 rounded-xl">
                    Mettre à jour le profil
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Bell className="h-6 w-6 text-pink-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span>Nouvelle réservation</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-pink-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nouvel avis en attente</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-pink-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nouveau message contact</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded text-pink-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Building className="h-6 w-6 text-pink-600" />
                    Informations société
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Nom du salon</Label>
                    <Input defaultValue="Daleelashes" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <Textarea defaultValue="Cotonou, Littoral" className="mt-1.5 rounded-xl" />
                  </div>
                  <Button className="bg-pink-600 hover:bg-pink-700 rounded-xl">
                    Enregistrer les modifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SERVICES & CONTACTS (inchangés) */}
          {activeTab === "services" && (
            <>
              {servicesLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((svc) => (
                    <Card
                      key={svc.slug}
                      className={cn(
                        "border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm",
                        !svc.active && "opacity-70"
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-semibold">{svc.name}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">/{svc.slug}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleServiceActive(svc.slug, svc.active)}
                            className="hover:bg-gray-100 rounded-full"
                          >
                            {svc.active ? (
                              <span className="text-emerald-600 text-2xl">✓</span>
                            ) : (
                              <span className="text-gray-400 text-2xl">✗</span>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Prix</span>
                            <span className="font-medium">{svc.price} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Durée</span>
                            <span className="font-medium">{svc.duration} min</span>
                          </div>
                          {svc.description && (
                            <p className="pt-4 border-t text-gray-600 leading-relaxed">{svc.description}</p>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl border-gray-300 hover:bg-gray-100 mt-6"
                          onClick={() => startEditService(svc)}
                        >
                          Modifier
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "contacts" && (
            <>
              {contactsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50/50 rounded-2xl border border-gray-200">
                  Aucun message reçu pour le moment
                </div>
              ) : (
                <div className="space-y-6">
                  {contacts.map((msg) => (
                    <Card
                      key={msg._id}
                      className={cn(
                        "border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm",
                        msg.status === "new" && "border-l-4 border-l-pink-500"
                      )}
                    >
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex-1 space-y-4">
                            <h3 className="font-semibold text-xl text-gray-900">
                              {msg.name} – {msg.subject}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(msg.createdAt).toLocaleString("fr-FR")} • {msg.email}
                              {msg.phone && ` • ${msg.phone}`}
                            </p>
                            <p className="mt-5 whitespace-pre-line text-gray-700 leading-relaxed">
                              {msg.message}
                            </p>
                          </div>

                          {msg.status === "new" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-pink-500 text-pink-600 hover:bg-pink-50 rounded-xl"
                              onClick={() => markAsRead(msg._id)}
                            >
                              Marquer lu
                            </Button>
                          )}

                          {msg.status === "read" && (
                            <span className="text-xs bg-gray-100 px-4 py-2 rounded-full font-medium">
                              Lu
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal preuve */}
      {selectedProof && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6 backdrop-blur-sm"
          onClick={() => setSelectedProof(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl bg-white">
            <img
              src={selectedProof}
              alt="Preuve d'acompte"
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-5 right-5 bg-white/90 p-4 rounded-full shadow-xl hover:bg-white transition-all duration-200"
              onClick={() => setSelectedProof(null)}
            >
              <X className="h-7 w-7 text-gray-900" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;