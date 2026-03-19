const BOOSTER_CATALOG = Object.freeze([
  { id: "starter", label: "Starter-Booster", tier: "Einstieg", price: 65, guaranteed: "Gewöhnlich" },
  { id: "market", label: "Markt-Booster", tier: "Standard", price: 120, guaranteed: "Selten" },
  { id: "champion", label: "Champion-Booster", tier: "Fortgeschritten", price: 210, guaranteed: "Selten" },
  { id: "relic", label: "Relikt-Booster", tier: "Elite", price: 340, guaranteed: "Episch" },
  { id: "astral", label: "Astral-Booster", tier: "Luxus", price: 520, guaranteed: "Legendär" },
]);

const PACK_TEMPLATES = Object.freeze([
  { id: "scout", label: "Rekrutenpaket", basePrice: 220 },
  { id: "battle", label: "Vorhutpaket", basePrice: 430 },
  { id: "command", label: "Kommandopaket", basePrice: 760 },
  { id: "vault", label: "Gewölbepaket", basePrice: 1180 },
  { id: "apex", label: "Zenitpaket", basePrice: 1680 },
]);

const FACTIONS = Object.freeze([
  "Glutorden",
  "Nebelchor",
  "Wurzelpakt",
  "Schattenzirkel",
  "Sturmwacht",
  "Runenschmiede",
  "Sternenhof",
  "Knochenbund",
]);

function createPackCatalog() {
  return FACTIONS.flatMap((faction) => PACK_TEMPLATES.map((template) => ({
    id: `${faction.toLowerCase()}-${template.id}`.replace(/[^a-z-]/g, ""),
    label: `${faction} ${template.label}`,
    faction,
    tier: template.label,
    price: template.basePrice,
  })));
}

module.exports = {
  BOOSTER_CATALOG,
  PACK_CATALOG: Object.freeze(createPackCatalog()),
};
