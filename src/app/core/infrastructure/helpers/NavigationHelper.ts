import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

export class NavigationHelper {
  static filterNavigationByModules(navigation: FuseNavItemType[], allowedModules: string[]): FuseNavItemType[] {
    return navigation
      .filter((item) => {
        // Si el item no tiene el campo 'module', se permite (ej: Dashboard)
        if (!item.module) {
          return true;
        }
        // Si tiene el campo 'module', verificar si está en la lista de permitidos
        return allowedModules.includes(item.module as string);
      })
      .map((item) => {
        // Filtrar recursivamente los hijos si los tiene
        if (item.children) {
          return {
            ...item,
            children: this.filterNavigationByModules(item.children, allowedModules),
          };
        }
        return item;
      })
      .filter((item) => {
        // Si es un grupo o colapsable y se quedó sin hijos tras el filtrado, lo removemos
        if ((item.type === 'group' || item.type === 'collapse') && item.children?.length === 0) {
          return false;
        }
        return true;
      });
  }
}
