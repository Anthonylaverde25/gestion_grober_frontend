import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Stack,
	TextField,
	MenuItem,
	Divider,
	CircularProgress
} from "@mui/material";
import { useState } from "react";

interface CreateUserModalProps {
	open: boolean;
	company: any; // Contexto de la empresa activa
	onClose: () => void;
	onConfirm: (userData: any) => void;
	isSubmitting?: boolean;
}

export default function CreateUserModal({ open, company, onClose, onConfirm, isSubmitting }: CreateUserModalProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "OPERATOR"
	});

	const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [field]: event.target.value });
	};

	const passwordsMatch = formData.password === formData.confirmPassword;
	const isFormValid =
		formData.name &&
		formData.email &&
		formData.password &&
		formData.password.length >= 6 &&
		passwordsMatch &&
		company?.id;

	const handleSave = () => {
		if (!isFormValid) return;
		onConfirm({ ...formData, companyId: company.id });
		onClose();
	};

	const inputStyles = {
		'& .MuiOutlinedInput-root': {
			borderRadius: 0,
			backgroundColor: '#ffffff',
			'& fieldset': {
				borderColor: '#e2e8f0',
			},
			'&:hover fieldset': {
				borderColor: '#94a3b8',
			},
			'&.Mui-focused fieldset': {
				borderColor: '#475569',
				borderWidth: '1px',
			},
		},
		'& .MuiInputBase-input': {
			fontSize: '14px',
			fontWeight: 500,
		},
		'& .MuiInputLabel-root': {
			fontSize: '12px',
			fontWeight: 700,
			textTransform: 'uppercase',
			letterSpacing: '0.05em',
			color: '#64748b'
		}
	};

	const readOnlyFieldStyle = {
		...inputStyles,
		'& .MuiOutlinedInput-root': {
			...inputStyles['& .MuiOutlinedInput-root'],
			bgcolor: '#f8fafc',
			'& fieldset': { borderColor: '#e2e8f0', borderStyle: 'dashed' },
		},
		'& .MuiInputBase-input': {
			color: '#334155',
			fontWeight: 700,
			fontFamily: 'JetBrains Mono, monospace',
			fontSize: '13px'
		}
	};

	const sectionLabelStyles = {
		color: '#0f172a',
		fontWeight: 900,
		textTransform: 'uppercase' as const,
		letterSpacing: '0.1em',
		fontSize: '11px',
		mb: 1.5,
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		'&::after': {
			content: '""',
			flex: 1,
			height: '1px',
			bgcolor: '#f1f5f9'
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 0,
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				}
			}}
		>
			<DialogTitle sx={{ bgcolor: "#e2e8f0", py: 1.5, px: 3 }}>
				<Box className="flex justify-between items-center">
					<Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
						Hoja de Alta de Usuario
					</Typography>
					<span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
				</Box>
			</DialogTitle>

			<DialogContent sx={{ p: 0 }}>
				{/* Barra de Metadatos Minimalista */}
				<Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
					<Box className="flex gap-4">
						<span>Módulo: <span className="text-on-surface">Administración de Equipo</span></span>
					</Box>
					<Box className="flex gap-4 text-right">
						<span>Contexto: <span className="text-primary">Registro de Integrante</span></span>
						<span>Fecha: <span className="text-on-surface font-data-tabular">{new Date().toLocaleDateString()}</span></span>
					</Box>
				</Box>

				<Box sx={{ p: 3 }}>
					<Stack spacing={3.5} sx={{ mt: 1 }}>
						{/* Sección 00: Contexto */}
						<Box>
							<Typography variant="caption" sx={sectionLabelStyles}>
								00. Contexto de Asignación
							</Typography>
							<TextField
								fullWidth
								label="Empresa de Trabajo"
								variant="outlined"
								size="small"
								value={company?.name || 'SIN SELECCIÓN'}
								InputProps={{ readOnly: true }}
								sx={readOnlyFieldStyle}
							/>
						</Box>

						{/* Sección 01: Identidad */}
						<Box>
							<Typography variant="caption" sx={sectionLabelStyles}>
								01. Datos de Identidad
							</Typography>
							<Stack spacing={2.5}>
								<TextField
									fullWidth
									label="Nombre Completo"
									variant="outlined"
									size="small"
									value={formData.name}
									onChange={handleChange('name')}
									sx={inputStyles}
								/>
								<TextField
									fullWidth
									label="Correo Electrónico"
									variant="outlined"
									size="small"
									type="email"
									value={formData.email}
									onChange={handleChange('email')}
									sx={inputStyles}
								/>

								<Stack direction="row" spacing={2}>
									<TextField
										fullWidth
										label="Contraseña"
										variant="outlined"
										size="small"
										type="password"
										value={formData.password}
										onChange={handleChange('password')}
										sx={inputStyles}
									/>
									<TextField
										fullWidth
										label="Confirmar Contraseña"
										variant="outlined"
										size="small"
										type="password"
										error={!passwordsMatch && formData.confirmPassword !== ""}
										helperText={(!passwordsMatch && formData.confirmPassword !== "") ? "Las contraseñas no coinciden" : ""}
										value={formData.confirmPassword}
										onChange={handleChange('confirmPassword')}
										sx={inputStyles}
									/>
								</Stack>
							</Stack>
						</Box>

						{/* Sección 02: Perfil */}
						<Box>
							<Typography variant="caption" sx={sectionLabelStyles}>
								02. Perfil Operativo
							</Typography>
							<TextField
								select
								fullWidth
								label="Rol de Sistema"
								size="small"
								value={formData.role}
								onChange={handleChange('role')}
								sx={inputStyles}
							>
								<MenuItem value="ADMIN" sx={{ fontSize: '13px', fontWeight: 600 }}>ADMINISTRADOR</MenuItem>
								<MenuItem value="SUPERVISOR" sx={{ fontSize: '13px', fontWeight: 600 }}>SUPERVISOR</MenuItem>
								<MenuItem value="OPERATOR" sx={{ fontSize: '13px', fontWeight: 600 }}>OPERARIO DE PLANTA</MenuItem>
							</TextField>
						</Box>
					</Stack>
				</Box>
			</DialogContent>

			<DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
				<Button
					onClick={onClose}
					sx={{
						color: '#64748b',
						fontWeight: 800,
						fontSize: '11px',
						textTransform: 'uppercase',
						letterSpacing: '0.05em',
						borderRadius: 0,
						'&:hover': { bgcolor: 'transparent', color: '#0f172a' }
					}}
				>
					Descartar
				</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					disabled={!isFormValid || isSubmitting}
					sx={{
						borderRadius: 0,
						px: 3,
						py: 1,
						bgcolor: '#334155',
						color: '#ffffff',
						fontWeight: 800,
						fontSize: '11px',
						textTransform: 'uppercase',
						letterSpacing: '0.1em',
						boxShadow: 'none',
						'&:hover': {
							bgcolor: '#1e293b',
							boxShadow: 'none',
						},
						'&.Mui-disabled': {
							bgcolor: '#e2e8f0',
							color: '#94a3b8'
						}
					}}
				>
					{isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Crear Integrante'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
