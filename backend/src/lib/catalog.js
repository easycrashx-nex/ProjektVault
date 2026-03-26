const BOOSTER_CATALOG = Object.freeze([
  { id: "starter", label: "Starter-Booster", tier: "Einstieg", price: 65, guaranteed: "Gewöhnlich" },
  { id: "market", label: "Markt-Booster", tier: "Standard", price: 120, guaranteed: "Selten" },
  { id: "champion", label: "Champion-Booster", tier: "Fortgeschritten", price: 210, guaranteed: "Selten" },
  { id: "relic", label: "Relikt-Booster", tier: "Elite", price: 340, guaranteed: "Episch" },
  { id: "astral", label: "Astral-Booster", tier: "Luxus", price: 520, guaranteed: "Legendär" },
  { id: "sovereign", label: "Souverän-Booster", tier: "Souverän", price: 760, guaranteed: "Legendär" },
  { id: "eclipse", label: "Eklipsen-Booster", tier: "Eklipse", price: 930, guaranteed: "Ultra Rare" },
  { id: "nexus", label: "Nexus-Booster", tier: "Nexus", price: 1180, guaranteed: "Ultra Rare" },
  { id: "cataclysm", label: "Kataklysmus-Booster", tier: "Kataklysmus", price: 1460, guaranteed: "Mythisch" },
  { id: "singularity", label: "Singularitäts-Booster", tier: "Singularität", price: 1820, guaranteed: "Transzendent" },
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

const COSMETIC_CATALOG = Object.freeze({
  avatars: Object.freeze([
    { id: "vault-core", label: "Kernsigille", price: 0, tier: "Start" },
    { id: "ember-mask", label: "Glutmaske", price: 180, tier: "Selten" },
    { id: "mist-orb", label: "Nebelorb", price: 180, tier: "Selten" },
    { id: "thorn-mark", label: "Dornenmarke", price: 180, tier: "Selten" },
    { id: "storm-eye", label: "Sturmauge", price: 260, tier: "Episch" },
    { id: "rune-disc", label: "Runenscheibe", price: 260, tier: "Episch" },
    { id: "astral-iris", label: "Astraliris", price: 420, tier: "Legendär" },
    { id: "mythic-crown", label: "Mythenkrone", price: 620, tier: "Mythisch" },
  ]),
  frames: Object.freeze([
    { id: "bronze-sigil", label: "Bronzerahmen", price: 0, tier: "Start" },
    { id: "silver-sigil", label: "Silberrahmen", price: 170, tier: "Selten" },
    { id: "verdant-ring", label: "Wurzelring", price: 210, tier: "Selten" },
    { id: "ember-edge", label: "Glutkante", price: 250, tier: "Episch" },
    { id: "storm-crest", label: "Sturmkranz", price: 250, tier: "Episch" },
    { id: "void-trace", label: "Schattenzug", price: 360, tier: "Legendär" },
    { id: "aurora-prism", label: "Auroraprisma", price: 520, tier: "Ultra Rare" },
    { id: "transcendent-halo", label: "Transzendenz-Halo", price: 760, tier: "Transzendent" },
  ]),
  titles: Object.freeze([
    { id: "vault-initiate", label: "Tresor-Novize", price: 0, tier: "Start" },
    { id: "market-runner", label: "Marktläufer", price: 90, tier: "Gewöhnlich" },
    { id: "pack-hunter", label: "Siegeljäger", price: 120, tier: "Gewöhnlich" },
    { id: "arena-scout", label: "Arenakundschafter", price: 160, tier: "Selten" },
    { id: "ember-tactician", label: "Gluttaktiker", price: 180, tier: "Selten" },
    { id: "mist-duelist", label: "Nebelduellant", price: 180, tier: "Selten" },
    { id: "thorn-warden", label: "Dornenwächter", price: 240, tier: "Episch" },
    { id: "rune-architect", label: "Runenarchitekt", price: 240, tier: "Episch" },
    { id: "market-oracle", label: "Marktorakel", price: 300, tier: "Legendär" },
    { id: "vault-master", label: "Projekt-Vault-Meister", price: 420, tier: "Legendär" },
    { id: "myth-bearer", label: "Mythenträger", price: 560, tier: "Mythisch" },
    { id: "transcendent-scion", label: "Transzendenten-Erbe", price: 780, tier: "Transzendent" },
  ]),
});

module.exports = {
  BOOSTER_CATALOG,
  PACK_CATALOG: Object.freeze(createPackCatalog()),
  COSMETIC_CATALOG,
};
