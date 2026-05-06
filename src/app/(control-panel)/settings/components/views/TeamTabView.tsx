'use client';

import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTeamMembers } from '../../api/hooks/team/useTeamMembers';
import { useUserAliases } from '../../api/hooks/team/useUserAliases';
import { useBusiness } from '@/app/contexts/BusinessContext';
import { TeamHeader } from '../team/TeamHeader';
import { TeamFilterBar } from '../team/TeamFilterBar';
import { TeamList } from '../team/TeamList';
import CreateUserModal from '../team/CreateUserModal';
import { AliasDialog } from '../team/AliasDialog';
import { ViewAliasesDialog } from '../team/ViewAliasesDialog';
import { SettingsTeamMember } from '../../types';

function TeamTabView() {
	const { activeCompany } = useBusiness();
	const { data: teamMembers, isLoading, createUser, isCreating } = useTeamMembers();
	const { createAlias, isCreating: isCreatingAlias } = useUserAliases();
	
	const [searchTerm, setSearchTerm] = useState('');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
	const [isViewAliasesModalOpen, setIsViewAliasesModalOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<SettingsTeamMember | null>(null);

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
		setSelectedMember(member);
		setIsAliasModalOpen(true);
	};

	const handleViewAliases = (member: SettingsTeamMember) => {
		setSelectedMember(member);
		setIsViewAliasesModalOpen(true);
	};

	const handleConfirmCreateAlias = async (aliasData: any) => {
		if (!selectedMember) return;
		
		try {
			await createAlias({
				userId: parseInt(selectedMember.id),
				name: aliasData.name,
				legajo: aliasData.legajo
			});
			setIsAliasModalOpen(false);
			setSelectedMember(null);
		} catch (error) {
			console.error('Error creating alias:', error);
		}
	};

	const handleConfig = (member: SettingsTeamMember) => {
		console.log('Configure member:', member.name);
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
				onViewAliases={handleViewAliases}
				onConfig={handleConfig}
			/>

			{/* Modal de Creación (Patrón Hoja de Registro) */}
			<CreateUserModal 
				open={isCreateModalOpen}
				company={activeCompany}
				onClose={() => setIsCreateModalOpen(false)}
				onConfirm={handleConfirmCreate}
				isSubmitting={isCreating}
			/>

			{/* Modal de Alias (Patrón Hoja de Registro Industrial) */}
			<AliasDialog 
				open={isAliasModalOpen}
				member={selectedMember}
				onClose={() => {
					setIsAliasModalOpen(false);
					setSelectedMember(null);
				}}
				onSubmit={handleConfirmCreateAlias}
				isSubmitting={isCreatingAlias}
			/>

			{/* Modal de Visualización de Alias */}
			<ViewAliasesDialog 
				open={isViewAliasesModalOpen}
				member={selectedMember}
				onClose={() => {
					setIsViewAliasesModalOpen(false);
					setSelectedMember(null);
				}}
				onAddAlias={handleAlias}
			/>
		</Box>
	);
}

export default TeamTabView;
