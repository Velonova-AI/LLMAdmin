"use client";

import { useEffect } from "react";
import { Admin, ListGuesser, ShowGuesser, EditGuesser } from "@/components/admin";
import { dataProvider } from "./dataProvider";
import { CustomRoutes, Resource } from "ra-core";
import { Route, Navigate } from "react-router";

import { AssistantList } from "./Assistantlist";
import { AssistantEdit } from "./Assistantedit";
import { AssistantShow } from "./Assistantshow";
import { AssistantCreate } from "./Assistantcreate";

// Import the learn page components
import GettingStartedPage from "../learn/page";
import IntroductionPage from "../learn/introduction/page";
import MVPPage from "../learn/mvp/page";
import PromptEngineeringPage from "../learn/prompt-engineering/page";
import VibeCodingPage from "../learn/vibe-coding/page";
import { i18nProvider } from "@/lib/i18nProvider";
import { ChatCreate, ChatList } from "./chat";
import { authProvider } from "./authProvider";
import { ChatPage } from "./ChatPage";
import { Dashboard } from "./Dashboard";


const App = () => {
  useEffect(() => {
    // Test query - logs to browser console
    
  }, []);

  return (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider} authProvider={authProvider} dashboard={Dashboard}>
      <Resource name="Chatb" list={ChatList} options={{ label: 'Chat History' }} create={ChatCreate}/>

      <Resource name="assistants" list={AssistantList} edit={AssistantEdit} show={AssistantShow} create={AssistantCreate} />

      <CustomRoutes>
        <Route path="/" element={<Navigate to="/assistants" replace />} />
        {/* <Route path="/signup" element={<SignupRedirect />} /> */}
        <Route path="/learn" element={<GettingStartedPage />} />
        <Route path="/learn/introduction" element={<IntroductionPage />} />
        <Route path="/learn/mvp" element={<MVPPage />} />
        <Route path="/learn/prompt-engineering" element={<PromptEngineeringPage />} />
        <Route path="/learn/vibe-coding" element={<VibeCodingPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </CustomRoutes>
    </Admin>
  );
};

export default App;
