<div className="p-6 border-b bg-indigo-600 text-white flex items-center justify-between">
  {/* Nome do App */}
  <h1
    className={`${
      sidebarVisible ? 'text-2xl' : 'text-lg'
    } font-semibold tracking-wide text-center w-full`} // Adicionado w-full e text-center
  >
    Leveling Life
  </h1>
  {/* Botão para mostrar/esconder a barra lateral */}
  <button
    onClick={toggleSidebar}
    className={`${
      sidebarVisible ? 'hidden' : 'block'
    } text-white p-2 rounded-full hover:bg-indigo-700`}
  >
    <Menu className="h-6 w-6" />
  </button>
</div>
