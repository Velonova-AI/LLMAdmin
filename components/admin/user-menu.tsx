import { Children, useCallback, useState } from "react";
import {
  Translate,
  useAuthProvider,
  useGetIdentity,
  useLogout,
  UserMenuContext,
} from "ra-core";
import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/app/admin/profile/profile-context";

export type UserMenuProps = {
  children?: React.ReactNode;
};

export function UserMenu({ children }: UserMenuProps) {
  const authProvider = useAuthProvider();
  const { data: identity } = useGetIdentity();
  const logout = useLogout();
  
  // Get profile version for refresh mechanism
  // ProfileProvider wraps Admin, so this should always be available
  const { profileVersion } = useProfile();

  const [open, setOpen] = useState(false);

  const handleToggleOpen = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  if (!authProvider) return null;

  return (
    <UserMenuContext.Provider value={{ onClose: handleClose }}>
      <DropdownMenu key={profileVersion} open={open} onOpenChange={handleToggleOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 ml-2 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={identity?.avatar} role="presentation" />
              <AvatarFallback>{identity?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {identity?.fullName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/my-profile" className="cursor-pointer flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <Translate i18nKey="ra.page.myProfile">My Profile</Translate>
            </Link>
          </DropdownMenuItem>
          {children}
          {Children.count(children) > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
            <LogOut />
            <Translate i18nKey="ra.auth.logout">Log out</Translate>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </UserMenuContext.Provider>
  );
}
