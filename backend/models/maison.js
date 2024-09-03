import mongoose from "mongoose";

const maisonSchema = new mongoose.Schema(
    {
    
    //   Description

      titre: {
        type: String,
      },

      description: {
        type: String,
      },

      catégorie:{
        type:String,
      },
  
      prix: {
        type: Number,
      },

      nomproprietaire: {
        type: String,
      },

      emailproprietaire: {
        type: String,
      },

      numproprietaire: {
        type: Number,
      },



    //   Media

      images: [String],



    //  Location

      adresse: {
        type: String,
      },

      gouvernorat: {
        type: String,
      },

      ville: { 
        type: String,
      },

      //DETAILS

      surface: {
        type: Number,
      },

      nb_chambre: {
        type: Number,
      },

      nb_salon: {
        type: Number,
      },

      nb_salleDeBain: {
        type: Number,
      },

      nb_etage: {
        type: Number,
      },

      dateAjout: {
        type: Date,
        default: Date.now,
      },

  
    //   Amenagement(équipements)


      meublé: {
        type: Boolean,
        default: false,
      },

      jardin: {
        type: Boolean,
        default: false,
      },  

      piscine: {
        type: Boolean,
        default: false,
      },

      garage: {
        type: Boolean,
        default: false,
      },

      ascenseur: {
        type: Boolean,
        default: false,
      },

      terrasse: {
        type: Boolean,
        default: false,
      },

      balcon: {
        type: Boolean,
        default: false,
      },

      climatisation: {
        type: Boolean,
        default: false,
      },

      chauffage: {
        type: Boolean,
        default: false,
      },

      interphone: {
        type: Boolean,
        default : false,
      },

      gardien: {
        type: Boolean,
        default: false,
      },

      alarme: {
        type: Boolean,
        default: false,
      },

      camera: {
        type: Boolean,
        default: false,
      },

      syndic: {
        type: Boolean,
        default: false,
      },

      cuisineEquipée: {
        type: Boolean,
        default: false,
      },

      cheminée: {
        type: Boolean,
        default: false,
      },

      vueMer: {
        type: Boolean,
        default: false,
      },

      vueMontagne: {
        type: Boolean,
        default: false, 
      },

      vueVille: {
        type: Boolean,
        default: false,
      },



    //   Autres
       
    autre: {
        type: String,
      },

    agentremarques: {
        type: String,
      },
    
    
    }

  );
  const Maison = mongoose.model("Maison", maisonSchema);

  export default Maison;