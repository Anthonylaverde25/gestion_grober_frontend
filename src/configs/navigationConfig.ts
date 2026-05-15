import i18n from "@i18n";
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18n.addResourceBundle("en", "navigation", en);
i18n.addResourceBundle("tr", "navigation", tr);
i18n.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: "monitoring",
    title: "Monitoreo y Control",
    type: "group",
    icon: "lucide:activity",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        icon: "lucide:layout-dashboard",
        url: "dashboard",
      },
    ],
  },
  {
    id: "divider-1",
    type: "divider",
  },
  {
    id: "production",
    title: "Gestión de Producción",
    subtitle: "Reportes de planta",
    type: "group",
    icon: "lucide:factory",
    translate: "PRODUCTION",
    module: "production",
    children: [
      {
        id: "production.line.performance",
        title: "Rendimiento de Líneas",
        subtitle: "Análisis de eficiencia",
        type: "item",
        icon: "lucide:trending-up",
        url: "production/lines-performance",
      },
      {
        id: "production.campaigns",
        title: "Campañas",
        subtitle: "Gestión de lotes",
        type: "item",
        icon: "lucide:layers",
        url: "campaigns",
      },
    ],
  },
  {
    id: "divider-2",
    type: "divider",
  },
  {
    id: "general-admin",
    title: "Administración General",
    subtitle: "Maestros del sistema",
    type: "group",
    icon: "lucide:database",
    translate: "GENERAL-ADMIN",
    children: [
      {
        id: "admin.clients",
        title: "Clientes",
        subtitle: "Cartera de clientes",
        type: "item",
        icon: "lucide:users",
        url: "/clients",
      },
      {
        id: "admin.articles",
        title: "Artículos",
        subtitle: "Catálogo de productos",
        type: "item",
        icon: "lucide:box",
        url: "articles",
      },
    ],
  },
  {
    id: "divider-3",
    type: "divider",
  },
  {
    id: "system-config",
    title: "Configuración",
    type: "group",
    icon: "lucide:settings",
    children: [
      {
        id: "settings",
        title: "Ajustes Globales",
        type: "item",
        icon: "lucide:sliders",
        url: "settings",
        module: "settings",
      },
    ],
  },
];

export default navigationConfig;
