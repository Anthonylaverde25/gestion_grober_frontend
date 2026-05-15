import FuseNavigation from "@fuse/core/FuseNavigation/FuseNavigation";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import SettingsAppNavigation from "../../lib/constants/SettingsAppNavigation";

type SettingsAppSidebarContentProps = {
  className?: string;
  onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppSidebarContent(props: SettingsAppSidebarContentProps) {
  const { className, onSetSidebarOpen } = props;
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <div>
      <div
        className={clsx(
          "flex items-center justify-center p-4 border border-b-slate-400",
          className,
        )}
      >
        <div className="">
          <Typography variant="h5" gutterBottom className="text-xl leading-tight font-bold tracking-tight text-[#0f172a] uppercase w-full">
            Configuración General
          </Typography>
        </div>

        {isMobile && (
          <IconButton
            onClick={() => onSetSidebarOpen(false)}
            aria-label="close left sidebar"
            size="small"
          >
            <FuseSvgIcon>lucide:x</FuseSvgIcon>
          </IconButton>
        )}
      </div>
      <div className="mt-3">
        <FuseNavigation navigation={SettingsAppNavigation.children} />
      </div>
    </div>
  );
}

export default SettingsAppSidebarContent;
