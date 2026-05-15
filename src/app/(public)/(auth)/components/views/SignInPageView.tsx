import Box from '@mui/material/Box';
import JwtLoginTab from '../tabs/sign-in/JwtSignInTab';
import SignInPageTitle from '../ui/SignInPageTitle';
import { styled, useTheme } from '@mui/material/styles';

const Watermark = styled('div')(() => ({
	position: 'absolute',
	top: '-250px',
	left: '-250px',
	width: '1400px',
	height: '1400px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 0,
	pointerEvents: 'none',
	opacity: 0.1,
	'& img': {
		width: '100%',
		height: 'auto',
		filter: 'grayscale(1) brightness(2)',
	}
}));

/**
 * The sign in page.
 * Ultra-Minimalist: No Card Design.
 */
function SignInPageView() {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<Box
			className="flex min-h-full w-full flex-col items-center justify-center p-16 sm:p-24"
			sx={{
				background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Large Brand Watermark */}
			<Watermark>
				<img
					src={isDark ? "/assets/images/logo/rxna_full_logo_dark.svg" : "/assets/images/logo/rxna_full_logo.svg"}
					alt="Watermark"
				/>
			</Watermark>

			{/* Background elements for industrial feel */}
			<Box
				className="absolute inset-0 opacity-10 pointer-events-none"
				sx={{
					backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>

			<Box className="relative z-10 w-full max-w-[600px] flex flex-col gap-4">
				<SignInPageTitle />
				<JwtLoginTab />

				<Box
					className="mt-8 flex items-center"
					sx={{ opacity: 0.3 }}
				>
					<div className="w-2 h-2 rounded-full bg-secondary-main mr-3" />
					<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
						Industrial Secure Terminal
					</span>
					<div className="flex-grow ml-4 border-t border-white/10" />
				</Box>
			</Box>
		</Box>
	);
}

export default SignInPageView;
