'use client';

import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTeamMembers } from '../../api/hooks/team/useTeamMembers';
import { useBusiness } from '@/app/contexts/BusinessContext';
import { TeamHeader } from '../team/TeamHeader';
import { TeamFilterBar } from '../team/TeamFilterBar';
import { TeamList } from '../team/TeamList';
import CreateUserModal from '../team/CreateUserModal';
import { SettingsTeamMember } from '../../types';

function TeamTabView() {
	const { activeCompany } = useBusiness();
	const { data: teamMembers, isLoading, createUser, isCreating } = useTeamMembers();
	const [searchTerm, setSearchTerm] = useState('');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const filteredData = useMemo(() => {
		if (!teamMembers) return [];
		return teamMembers.filter(member => 
			member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [teamMembers, searchTerm]);

	const handleAddUser = () => {
		setIsCreateModalOpen(true);
	};

	const handleConfirmCreate = async (userData: any) => {
		try {
			await createUser({
				name: userData.name,
				email: userData.email,
				password: userData.password,
				role: userData.role,
				company_id: userData.companyId
			});
			setIsCreateModalOpen(false);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	};

	const handleAlias = (member: SettingsTeamMember) => {
		console.log('Assign Alias for:', member.name);
	};

	const handleConfig = (member: SettingsTeamMember) => {
		console.log('Configure member:', member.name);
	};

	const handleDelete = (member: SettingsTeamMember) => {
		console.log('Delete member:', member.name);
	};

	if (isLoading) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
					Sincronizando con el servidor...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ bgcolor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			{/* Componente de Cabecera */}
			<TeamHeader 
				count={filteredData.length} 
				onAddUser={handleAddUser} 
			/>

			{/* Barra de Filtros */}
			<TeamFilterBar 
				value={searchTerm} 
				onChange={setSearchTerm} 
			/>

			{/* Lista de Integrantes */}
			<TeamList 
				members={filteredData} 
				onAlias={handleAlias}
				onConfig={handleConfig}
				onDelete={handleDelete}
			/>

			{/* Modal de Creación (Patrón Hoja de Registro) */}
			<CreateUserModal 
				open={isCreateModalOpen}
				company={activeCompany}
				onClose={() => setIsCreateModalOpen(false)}
				onConfirm={handleConfirmCreate}
				isSubmitting={isCreating}
			/>
		</Box>
	);
}

export default TeamTabView;
