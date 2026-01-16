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


const App = () => {
  useEffect(() => {
    // Test query - logs to browser console
    
  }, []);

  return (
    <Admin dataProvider={dataProvider} >
      {/* <Resource name="Chatb" list={ChatList} options={{ label: 'Chat History' }} create={ChatCreate}/> */}

      <Resource name="assistants" list={AssistantList} edit={AssistantEdit} show={AssistantShow} create={AssistantCreate} />

      <CustomRoutes>
        <Route path="/" element={<Navigate to="/assistants" replace />} />
     
      </CustomRoutes>
    </Admin>
  );
};

export default App;
