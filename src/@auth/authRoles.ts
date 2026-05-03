/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * Acceso total al sistema
	 */
	superAdmin: ['super-admin'],

	/**
	 * Administradores globales y de empresa
	 */
	admin: ['super-admin', 'admin', 'company-manager'],

	/**
	 * Propietarios y Gerentes (Monitoreo)
	 */
	owner: ['super-admin', 'admin', 'owner', 'company-manager'],

	/**
	 * Roles de Supervisión
	 */
	allRoles: ['super-admin', 'admin', 'company-manager', 'supervisor'],

	/**
	 * Roles Operativos (Carga de datos)
	 */
	operator: ['super-admin', 'admin', 'company-manager', 'supervisor', 'operator'],

	/**
	 * Todos los usuarios autenticados
	 */
	user: ['super-admin', 'admin', 'owner', 'company-manager', 'supervisor', 'operator', 'viewer'],

	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: []
};

export default authRoles;
