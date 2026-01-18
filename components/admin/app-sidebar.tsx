import { createElement } from "react";
import {
  useCanAccess,
  useCreatePath,
  useGetResourceLabel,
  useHasDashboard,
  useResourceDefinitions,
  useTranslate,
  useGetList,
} from "ra-core";
import { Link, useMatch, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, House, List, MessageSquarePlus } from "lucide-react";

export function AppSidebar() {
  const hasDashboard = useHasDashboard();
  const resources = useResourceDefinitions();
  const { openMobile, setOpenMobile } = useSidebar();
  const handleClick = () => {
    if (openMobile) {
      setOpenMobile(false);
    }
  };
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <Bike className="!size-5" />
                <span className="text-base font-semibold">Velonova AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasDashboard ? (
                <DashboardMenuItem onClick={handleClick} />
              ) : null}
              {Object.keys(resources)
                .filter((name) => resources[name].hasList && name !== 'Chatb')
                .map((name) => (
                  <ResourceMenuItem
                    key={name}
                    name={name}
                    onClick={handleClick}
                  />
                ))}
              <NewChatMenuItem onClick={handleClick} />
              <ChatHistorySection onClick={handleClick} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export const DashboardMenuItem = ({ onClick }: { onClick?: () => void }) => {
  const translate = useTranslate();
  const label = translate("ra.page.overview", {
    _: "Overview",
  });
  const match = useMatch({ path: "/", end: true });
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!match}>
        <Link to="/" onClick={onClick}>
          <House />
          {label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const NewChatMenuItem = ({ onClick }: { onClick?: () => void }) => {
  const createPath = useCreatePath();
  const to = createPath({
    resource: "Chatb",
    type: "create",
  });
  const match = useMatch({ path: "/Chatb/create", end: false });
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!match}>
        <Link to={to} onClick={onClick}>
          <MessageSquarePlus />
          New Chat
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const ResourceMenuItem = ({
  name,
  onClick,
}: {
  name: string;
  onClick?: () => void;
}) => {
  const { canAccess, isPending } = useCanAccess({
    resource: name,
    action: "list",
  });
  const resources = useResourceDefinitions();
  const getResourceLabel = useGetResourceLabel();
  const createPath = useCreatePath();
  const to = createPath({
    resource: name,
    type: "list",
  });
  const match = useMatch({ path: to, end: false });

  if (isPending) {
    return <Skeleton className="h-8 w-full" />;
  }

  if (!resources || !resources[name] || !canAccess) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!match}>
        <Link to={to} state={{ _scrollToTop: true }} onClick={onClick}>
          {resources[name].icon ? (
            createElement(resources[name].icon)
          ) : (
            <List />
          )}
          {getResourceLabel(name, 2)}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const AdminChatItem = ({ 
  chat, 
  isActive, 
  onClick 
}: { 
  chat: { id: string; title: string }; 
  isActive: boolean; 
  onClick?: () => void;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={`/chat/${chat.id}`} onClick={onClick}>
          <span className="truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const ChatHistorySection = ({ onClick }: { onClick?: () => void }) => {
  const { data, isLoading, error } = useGetList("Chatb", {
    pagination: { page: 1, perPage: 20 },
    sort: { field: "createdAt", order: "DESC" },
  });

  const location = useLocation();
  // Extract chat ID from pathname like /chat/123
  const pathnameChatId = location.pathname?.match(/\/chat\/([^/]+)/)?.[1];
  const currentChatId = pathnameChatId;

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
            Chats
          </div>
          <SidebarMenu>
            {[1, 2, 3].map((i) => (
              <SidebarMenuItem key={i}>
                <Skeleton className="h-8 w-full" />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (error || !data || data.length === 0) {
    return null;
  }

  // Group chats by date
  const groupedChats = groupChatsByDate(data);

  const hasAnyChats = 
    groupedChats.today.length > 0 ||
    groupedChats.yesterday.length > 0 ||
    groupedChats.lastWeek.length > 0 ||
    groupedChats.lastMonth.length > 0 ||
    groupedChats.older.length > 0;

  if (!hasAnyChats) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
          Chats
        </div>
        <SidebarMenu>
          {groupedChats.today.length > 0 && (
            <>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Today
              </div>
              {groupedChats.today.map((chat) => (
                <AdminChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onClick={onClick}
                />
              ))}
            </>
          )}
          {groupedChats.yesterday.length > 0 && (
            <>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Yesterday
              </div>
              {groupedChats.yesterday.map((chat) => (
                <AdminChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onClick={onClick}
                />
              ))}
            </>
          )}
          {groupedChats.lastWeek.length > 0 && (
            <>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Last 7 days
              </div>
              {groupedChats.lastWeek.map((chat) => (
                <AdminChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onClick={onClick}
                />
              ))}
            </>
          )}
          {groupedChats.lastMonth.length > 0 && (
            <>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Last month
              </div>
              {groupedChats.lastMonth.map((chat) => (
                <AdminChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onClick={onClick}
                />
              ))}
            </>
          )}
          {groupedChats.older.length > 0 && (
            <>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Older
              </div>
              {groupedChats.older.map((chat) => (
                <AdminChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onClick={onClick}
                />
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

function groupChatsByDate(chats: Array<{ id: string; title: string; createdAt: string | Date }>) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return chats.reduce(
    (groups, chat) => {
      // Handle both string and Date types for createdAt
      const chatDate = new Date(chat.createdAt);
      chatDate.setHours(0, 0, 0, 0);

      if (chatDate.getTime() === today.getTime()) {
        groups.today.push(chat);
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo && chatDate < today) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo && chatDate <= oneWeekAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [] as Array<{ id: string; title: string; createdAt: string | Date }>,
      yesterday: [] as Array<{ id: string; title: string; createdAt: string | Date }>,
      lastWeek: [] as Array<{ id: string; title: string; createdAt: string | Date }>,
      lastMonth: [] as Array<{ id: string; title: string; createdAt: string | Date }>,
      older: [] as Array<{ id: string; title: string; createdAt: string | Date }>,
    }
  );
}
