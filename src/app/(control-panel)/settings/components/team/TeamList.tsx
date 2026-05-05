import { Stack, Divider, Box } from '@mui/material';
import { SettingsTeamMember } from '../../types';
import { TeamListItem } from './TeamListItem';

interface TeamListProps {
	members: SettingsTeamMember[];
	onAlias?: (member: SettingsTeamMember) => void;
	onViewAliases?: (member: SettingsTeamMember) => void;
	onConfig?: (member: SettingsTeamMember) => void;
}

export function TeamList({ members, onAlias, onViewAliases, onConfig }: TeamListProps) {
	return (
		<Stack spacing={0}>
			{members.map((member) => (
				<Box key={member.id}>
					<TeamListItem 
						member={member} 
						onAlias={onAlias}
						onViewAliases={onViewAliases}
						onConfig={onConfig}
					/>
					<Divider sx={{ mx: 3, borderColor: '#f2f2f2' }} />
				</Box>
			))}
		</Stack>
	);
}
