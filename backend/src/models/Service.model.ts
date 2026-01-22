import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  slug: string;           // ← AJOUTÉ : ID personnalisé
  name: string;
  description: string;
  price: number;
  duration: number;       // minutes
  active: boolean;        // ← AJOUTÉ : pour activer/désactiver
}

const ServiceSchema: Schema = new Schema(
  {
    slug: { 
      type: String, 
      required: true, 
      unique: true,       // Slug unique
      trim: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    price: { 
      type: Number, 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true 
    },
    active: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Index pour recherche rapide par slug
ServiceSchema.index({ slug: 1 });

export default mongoose.model<IService>("Service", ServiceSchema);