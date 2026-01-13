import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  LogOut,
  Settings,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isAdminLoggedIn,
  adminLogout,
  getBookings,
  updateBooking,
  getAvailability,
  setAvailability,
  addBlockedDate,
  removeBlockedDate,
  getBlockedDates,
  type Booking,
  type Availability,
} from "@/lib/storage";
import { SERVICES, BUSINESS_INFO } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "availability" | "settings">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailabilityState] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setBookings(getBookings());
    setAvailabilityState(getAvailability());
    setBlockedDates(getBlockedDates().map((b) => b.date));
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    updateBooking(bookingId, { status });
    loadData();
  };

  const handleAvailabilityChange = (dayOfWeek: number, field: keyof Availability, value: any) => {
    const updated = availability.map((a) =>
      a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a
    );
    setAvailability(updated);
    setAvailabilityState(updated);
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate) {
      addBlockedDate(newBlockedDate);
      setNewBlockedDate("");
      loadData();
    }
  };

  const handleRemoveBlockedDate = (date: string) => {
    removeBlockedDate(date);
    loadData();
  };

  // Stats
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.servicePrice, 0);
  const todayBookings = bookings.filter(
    (b) => b.date === new Date().toISOString().split("T")[0] && b.status !== "cancelled"
  );

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const tabs = [
    { id: "overview", label: "Aperçu", icon: Sparkles },
    { id: "bookings", label: "Réservations", icon: Calendar },
    { id: "availability", label: "Disponibilités", icon: CalendarDays },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 hidden lg:block">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold">
            Dalee<span className="text-primary font-light italic">_lashes</span>
          </h1>
          <p className="text-sm text-muted-foreground">Administration</p>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-semibold">
            Dalee<span className="text-primary font-light italic">_lashes</span>
          </h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 pt-32 lg:pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="heading-section">Tableau de bord</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-display font-semibold">{pendingBookings}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-display font-semibold">{confirmedBookings}</p>
                  <p className="text-sm text-muted-foreground">Confirmées</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-display font-semibold">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total clients</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-display font-semibold">${totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Revenus</p>
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-lg mb-4">Rendez-vous aujourd'hui</h3>
                {todayBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun rendez-vous aujourd'hui
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.clientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.serviceName} • {booking.time}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="heading-section">Réservations</h2>

              {bookings.length === 0 ? (
                <div className="bg-card rounded-2xl p-12 border border-border text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune réservation pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-card rounded-2xl p-6 border border-border"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : booking.status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {booking.status === "pending"
                                  ? "En attente"
                                  : booking.status === "confirmed"
                                  ? "Confirmée"
                                  : booking.status === "completed"
                                  ? "Terminée"
                                  : "Annulée"}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-2">
                              {booking.serviceName} • <strong>${booking.servicePrice}</strong>
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.date).toLocaleDateString("fr-CA")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {booking.clientPhone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {booking.clientEmail}
                              </span>
                            </div>
                          </div>

                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="luxury"
                                onClick={() => handleStatusChange(booking.id, "confirmed")}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Confirmer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(booking.id, "cancelled")}
                              >
                                <XCircle className="w-4 h-4" />
                                Refuser
                              </Button>
                            </div>
                          )}

                          {booking.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleStatusChange(booking.id, "completed")}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Marquer terminée
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Availability Tab */}
          {activeTab === "availability" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="heading-section">Disponibilités</h2>

              {/* Weekly Schedule */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-lg mb-6">Horaires hebdomadaires</h3>
                <div className="space-y-4">
                  {availability.map((day) => (
                    <div
                      key={day.dayOfWeek}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Switch
                          checked={day.enabled}
                          onCheckedChange={(checked) =>
                            handleAvailabilityChange(day.dayOfWeek, "enabled", checked)
                          }
                        />
                        <span className="font-medium w-24">{dayNames[day.dayOfWeek]}</span>
                      </div>
                      {day.enabled && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={day.startTime}
                            onChange={(e) =>
                              handleAvailabilityChange(day.dayOfWeek, "startTime", e.target.value)
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">à</span>
                          <Input
                            type="time"
                            value={day.endTime}
                            onChange={(e) =>
                              handleAvailabilityChange(day.dayOfWeek, "endTime", e.target.value)
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocked Dates */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-lg mb-6">Dates bloquées</h3>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="luxury" onClick={handleAddBlockedDate}>
                    Bloquer
                  </Button>
                </div>
                {blockedDates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune date bloquée
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive"
                      >
                        <span>{new Date(date).toLocaleDateString("fr-CA")}</span>
                        <button
                          onClick={() => handleRemoveBlockedDate(date)}
                          className="hover:bg-destructive/20 rounded-full p-1"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="heading-section">Paramètres</h2>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-lg mb-6">Informations du salon</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Nom:</strong> {BUSINESS_INFO.name}
                  </p>
                  <p>
                    <strong className="text-foreground">Téléphone:</strong> {BUSINESS_INFO.phone}
                  </p>
                  <p>
                    <strong className="text-foreground">Localisation:</strong> {BUSINESS_INFO.location}
                  </p>
                  <p>
                    <strong className="text-foreground">Horaires:</strong> {BUSINESS_INFO.hours.days}, {BUSINESS_INFO.hours.time}
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-lg mb-6">Services & Tarifs</h3>
                <div className="space-y-3">
                  {SERVICES.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <p className="font-semibold text-primary">${service.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
