import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import ProblemSetter from "./pages/ProblemSetter";
import ContestCreator from "./pages/ContestCreator";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Standings from "./pages/stading";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contests" element={<Layout><Contests /></Layout>} />
          <Route path="/contestDetail" element={<Layout><ContestDetail /></Layout>} />
          <Route path="/problems" element={<Layout><Problems /></Layout>} />
          <Route path="/problemDetail" element={<Layout><ProblemDetail /></Layout>} />
          <Route path="/problem-setter" element={<Layout><ProblemSetter /></Layout>} />
          <Route path="/contest-creator" element={<Layout><ContestCreator /></Layout>} />
           <Route path="/standings" element={<Layout><Standings /></Layout>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
