--- a/src/pages/ChatPageWithMenu.tsx
+++ b/src/pages/ChatPageWithMenu.tsx
@@ -1,6 +1,6 @@
 import React, { useState, useCallback } from 'react'
-import ChatInterface from '../components/ChatInterface'
+import ChatInterface from '../components/ChatInterface'
 import { MenuIcon } from '@heroicons/react/outline'
 import LogoIcon from '../components/icons/LogoIcon'
 import UserAvatar from '../components/UserAvatar'
@@ -15,18 +15,31 @@ export default function ChatPageWithMenu() {
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const toggleSidebar = useCallback(() => setSidebarOpen(o => !o), [])

-  return (
-    <div className="flex h-screen">
-      {sidebarOpen && <HamburgerMenu />}
-
-      <div className="flex-1 flex flex-col">
-        {/* antigo header */}
-        <div className="flex items-center justify-between p-4 bg-gray-900">
-          <HamburgerMenu onClose={toggleSidebar} />
-          <span className="text-cyan-400 font-bold">NexlaGPT</span>
-          <UserAvatar />
-        </div>
-        {/* fim antigo header */}
+  return (
+    <div className="flex h-screen">
+      {sidebarOpen && <HamburgerMenu onClose={toggleSidebar} />}
+
+      <div className="flex-1 flex flex-col">
+        {/* <<< CABEÇALHO ATUALIZADO >>> */}
+        <header className="flex items-center justify-between w-full p-4 bg-gray-900 shadow-sm">
+          {/* ícone de menu */}
+          <button
+            onClick={toggleSidebar}
+            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
+          >
+            <MenuIcon className="w-6 h-6 text-cyan-400" />
+          </button>
+
+          {/* logo centralizado */}
+          <div className="flex-1 flex justify-center items-center space-x-2">
+            <LogoIcon className="w-8 h-8" />
+            <span className="text-xl font-semibold text-cyan-400">
+              NexlaGPT
+            </span>
+          </div>
+
+          {/* avatar de perfil */}
+          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
+            <UserAvatar />
+          </button>
+        </header>
+        {/* <<< FIM CABEÇALHO >>> */}
 
         <main className="flex-1 overflow-hidden">
           <ChatInterface
