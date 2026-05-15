import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import Button from '@mui/material/Button';
import useJwtAuth from '../useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	email: '',
	password: '',
	remember: true
};

function JwtSignInForm() {
	const { signIn } = useJwtAuth();

	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		setValue('email', 'admin@grober.com', { shouldDirty: true, shouldValidate: true });
		setValue('password', 'password', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		signIn({
			email,
			password
		}).catch((error) => {
			const errorData = error?.data as {
				type: 'email' | 'password' | 'remember' | `root.${string}` | 'root';
				message: string;
			}[];

			errorData?.forEach?.((err) => {
				setError(err.type, {
					type: 'manual',
					message: err.message
				});
			});
		});
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='mb-5'>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-[10px]"
							label="Correo Electrónico"
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="filled"
							required
							fullWidth
							sx={{
								'& .MuiFilledInput-root': {
									backgroundColor: 'rgba(255, 255, 255, 0.08)',
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.12)',
									},
									'&.Mui-focused': {
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
									},
								},
								'& .MuiInputLabel-root': {
									color: 'rgba(255, 255, 255, 0.7)',
									fontWeight: 600,
									'&.Mui-focused': {
										color: 'secondary.main',
									},
								},
								'& .MuiFilledInput-input': {
									color: '#ffffff',
									paddingTop: '24px',
									paddingBottom: '12px',
								}
							}}
						/>
					)}
				/>
			</div>


			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-[10px]"
						label="Contraseña"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="filled"
						required
						fullWidth
						sx={{
							'& .MuiFilledInput-root': {
								backgroundColor: 'rgba(255, 255, 255, 0.08)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.12)',
								},
								'&.Mui-focused': {
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
								},
							},
							'& .MuiInputLabel-root': {
								color: 'rgba(255, 255, 255, 0.7)',
								fontWeight: 600,
								'&.Mui-focused': {
									color: 'secondary.main',
								},
							},
							'& .MuiFilledInput-input': {
								color: '#ffffff',
								paddingTop: '24px',
								paddingBottom: '12px',
							}
						}}
					/>
				)}
			/>


			<div className='mt-5'>
				<Button
					variant="contained"
					color="secondary"
					className="mt-4 w-full"
					aria-label="Iniciar Sesión"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Iniciar Sesión
				</Button>
			</div>
		</form>
	);
}

export default JwtSignInForm;
