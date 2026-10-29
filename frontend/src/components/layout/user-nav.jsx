import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, KeyRound, LogOut, User as UserIcon } from 'lucide-react'

export function UserNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8.5 rounded-full ring-1 ring-border/80 hover:ring-primary/40 focus-visible:ring-ring"
          />
        }
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name || 'User'}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-primary/10 font-semibold text-xs text-primary">
            {initials}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2 font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground leading-none truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
            <LayoutDashboard className="mr-2 size-4 text-muted-foreground" />
            <span>Dashboard</span>
          </DropdownMenuItem>

          {user?.authProvider === 'local' && (
            <DropdownMenuItem
              onClick={() => navigate('/change-password')}
              className="cursor-pointer"
            >
              <KeyRound className="mr-2 size-4 text-muted-foreground" />
              <span>Change Password</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="mr-2 size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
