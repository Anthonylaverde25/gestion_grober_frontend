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
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "heroicons-outline:home",
    url: "dashboard",
  },

  {
    id: "settings",
    title: "Ajustes",
    type: "item",
    icon: "heroicons-outline:cog",
    url: "settings",
    module: "settings",
  },

  {
    id: "general-admin",
    title: "Administracion General",
    subtitle: "Panel de administración general",
    type: "group",
    icon: "lucide:layout-dashboard",
    translate: "GENERAL-ADMIN",
    children: [
      {
        id: "admin.clients",
        title: "Clientes",
        subtitle: "Administrar clientes",
        type: "item",
        icon: "lucide:clipboard-check",
        url: "/clients",
      },
      {
        id: "admin.articles",
        title: "Artículos",
        subtitle: "Administrar artículos",
        type: "item",
        icon: "lucide:clipboard-check",
        url: "articles",
      },
    ],
  },
  {
    id: "production",
    title: "Producción",
    subtitle: "Reportes de producción",
    type: "group",
    icon: "lucide:layout-dashboard",
    translate: "PRODUCTION",
    module: "production",
    children: [
      // {
      //   id: "production.extraction.machines",
      //   title: "Extracción de Máquinas",
      //   subtitle: "Reporte de extracción de máquinas",
      //   type: "item",
      //   icon: "lucide:clipboard-check",
      //   url: "production/extraction",
      // },
      {
        id: "production.line.performance",
        title: "Rendimiento de Líneas",
        subtitle: "Reporte de rendimiento de líneas",
        type: "item",
        icon: "lucide:clipboard-check",
        url: "production/lines-performance",
      },
      {
        id: "production.campaigns",
        title: "Campañas",
        subtitle: "Gestión de campañas activas",
        type: "item",
        icon: "heroicons-outline:view-boards",
        url: "campaigns",
      },
    ],
  },
];

export default navigationConfig;
