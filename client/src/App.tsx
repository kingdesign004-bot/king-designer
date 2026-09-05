import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/MessagesPage";
import AdminPage from "./pages/AdminPage";
import SearchPage from "./pages/SearchPage";
import BlockListPage from "./pages/BlockListPage";
import FollowSuggestionsPage from "./pages/FollowSuggestionsPage";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/profile/:id" component={ProfilePage} />
    <Route path="/notifications" component={NotificationsPage} />
    <Route path="/messages" component={MessagesPage} />
    <Route path="/admin" component={AdminPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/block-list" component={BlockListPage} />
    <Route path="/suggestions" component={FollowSuggestionsPage} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
