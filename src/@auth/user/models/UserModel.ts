import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { User } from '@auth/user';
import { CompanyMapper } from '@/app/core/infrastructure/mappers/CompanyMapper';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data?: PartialDeep<User> & { name?: string; roles?: string[]; last_active_company_id?: string; is_active?: boolean }): User {
	data = data || {};

	const displayName = data.displayName || data.name || null;
	const role = data.role || data.roles || null;
	const lastActiveCompanyId = data.lastActiveCompanyId || data.last_active_company_id || null;

	const companies = data.companies
		? data.companies.map((company: any) => {
				// If it's already a domain object (has consortiumId), return it
				if (company.consortiumId) {
					return company;
				}
				// Otherwise map it from DTO
				return CompanyMapper.toDomain(company);
		  })
		: [];

	return _.defaults(
		{
			...data,
			displayName,
			role,
			lastActiveCompanyId,
			companies
		},
		{
			id: null,
			role: null, // guest
			displayName: null,
			photoURL: '',
			email: '',
			shortcuts: [],
			settings: {},
			loginRedirectUrl: '/',
			companies: [],
			lastActiveCompanyId: null
		}
	) as User;
}

export default UserModel;
