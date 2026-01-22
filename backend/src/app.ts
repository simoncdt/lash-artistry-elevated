import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import availabilityRoutes from "./routes/availability.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Autoriser le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true
}));

// Parser JSON
app.use(express.json());

// Parser URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Logger simple (en développement)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Route de test
app.get("/", (req, res) => {
  res.json({ 
    message: "API Dalee Lashes - Système de réservation",
    version: "1.0.0",
    endpoints: {
      availability: "/api/availability",
      bookings: "/api/bookings",
      services: "/api/services"
    }
  });
});

// Routes API
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

// ============================================
// GESTION DES ERREURS
// ============================================

// Route non trouvée
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route non trouvée",
    path: req.path 
  });
});

// Gestionnaire d'erreurs global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erreur globale:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

export default app;