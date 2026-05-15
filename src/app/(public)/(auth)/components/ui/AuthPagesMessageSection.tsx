import Box from '@mui/material/Box';

function AuthPagesMessageSection() {
	return (
		<Box
			className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 md:flex lg:px-28"
			sx={{
				backgroundColor: 'primary.dark',
				color: 'primary.contrastText'
			}}
		>
			<svg
				className="pointer-events-none absolute inset-0"
				viewBox="0 0 960 540"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMax slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Box
					component="g"
					className="opacity-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="100"
				>
					<circle
						r="234"
						cx="196"
						cy="23"
					/>
					<circle
						r="234"
						cx="790"
						cy="491"
					/>
				</Box>
			</svg>
			
			<div className="relative z-10 w-full max-w-4xl">
				<div className="flex items-center mb-12">
					<img 
						src="/assets/images/logo/rxna_full_logo_dark.svg" 
						className="w-80 opacity-90"
						alt="RXNA Glass"
					/>
				</div>
				<div className="text-7xl leading-[1.1] font-black tracking-tighter text-gray-100 uppercase">
					<div>Sistema de</div>
					<div>seguimiento de</div>
					<div>producción</div>
				</div>
				<div className="mt-6 text-xl leading-relaxed tracking-tight text-gray-400 max-w-lg">
					Gestión inteligente y control de precisión para la industria del vidrio. Optimice sus procesos y aumente su rentabilidad con RXNA Glass.
				</div>
				<div className="mt-12 flex items-center">
					<div className="w-12 h-1 bg-secondary-main rounded-full mr-4" />
					<div className="font-bold tracking-widest uppercase text-secondary-main text-sm">
						Industrial Performance Systems
					</div>
				</div>
			</div>
		</Box>
	);
}

export default AuthPagesMessageSection;
