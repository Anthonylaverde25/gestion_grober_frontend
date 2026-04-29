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
    id: "articles",
    title: "Artículos",
    type: "item",
    icon: "heroicons-outline:shopping-cart",
    url: "articles",
  },
  {
    id: "settings",
    title: "Ajustes",
    type: "item",
    icon: "heroicons-outline:cog",
    url: "settings",
  },
  {
    id: "example-component",

    title: "Example",
    translate: "EXAMPLE",
    type: "item",
    icon: "lucide:star",
    url: "example",
  },
  {
    id: "production",
    title: "Producción",
    subtitle: "Reportes de producción",
    type: "group",
    icon: "lucide:layout-dashboard",
    translate: "PRODUCTION",
    children: [
      {
        id: "production.extraction.machines",
        title: "Extracción de Máquinas",
        subtitle: "Reporte de extracción de máquinas",
        type: "item",
        icon: "lucide:clipboard-check",
        url: "production/extraction",
      },
    ],
  },

  {
    id: "divider-1",
    type: "divider",
    title: "Reports",
  },

  {
    id: "apps.ecommerce",
    title: "Producción",
    subtitle: "Reportes de producción",
    type: "collapse",
    icon: "lucide:shopping-cart",
    children: [
      {
        id: "extraction",
        title: "Extracción",
        type: "item",
        url: "apps/e-commerce/products",
        end: false,
      },
    ],
  },
];

export default navigationConfig;
