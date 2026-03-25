export type Lang = 'en' | 'es'

export const translations = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    agents: 'Agents',
    adminPanel: 'Admin Panel',
    settings: 'Settings',
    signOut: 'Sign Out',

    // Auth
    signIn: 'Sign In',
    signInTitle: 'Welcome back',
    signInSubtitle: 'Sign in to your LeadFlux account',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'you@company.com',
    passwordPlaceholder: '••••••••',
    signingIn: 'Signing in...',
    invalidCredentials: 'Invalid email or password',

    // Dashboard
    leads: 'Leads',
    allLeads: 'All Leads',
    myLeads: 'My Leads',
    noLeads: 'No leads yet',
    noLeadsDesc: 'Leads will appear here once they are assigned.',
    leadName: 'Name',
    leadEmail: 'Email',
    leadPhone: 'Phone',
    assignedTo: 'Assigned To',
    status: 'Status',
    responseTime: 'Response Time',
    createdAt: 'Created',
    updateStatus: 'Update Status',
    minutes: 'min',
    justAssigned: 'Just assigned',

    // Status
    new: 'New',
    contacted: 'Contacted',
    closed: 'Closed',

    // Agents
    agentsList: 'Agents',
    addAgent: 'Add Agent',
    agentName: 'Full Name',
    agentNamePlaceholder: 'John Doe',
    agentEmail: 'Email Address',
    agentPassword: 'Password',
    agentRole: 'Role',
    roleAgent: 'Agent',
    roleAdmin: 'Admin',
    active: 'Active',
    inactive: 'Inactive',
    activate: 'Activate',
    deactivate: 'Deactivate',
    deleteAgent: 'Delete',
    confirmDelete: 'Are you sure you want to delete this agent?',
    creating: 'Creating...',
    createAgent: 'Create Agent',
    cancel: 'Cancel',
    noAgents: 'No agents yet',
    noAgentsDesc: 'Create your first agent to start distributing leads.',

    // Admin
    totalLeads: 'Total Leads',
    avgResponseTime: 'Avg Response Time',
    leaderboard: 'Leaderboard',
    rank: 'Rank',
    agent: 'Agent',
    totalAssigned: 'Assigned',
    contacted2: 'Contacted',
    closedLeads: 'Closed',
    assignmentType: 'Assignment Type',
    roundRobin: 'Round Robin',
    saveSettings: 'Save Settings',
    saving: 'Saving...',
    saved: 'Saved!',

    // Misc
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    language: 'Language',
  },
  es: {
    // Nav
    dashboard: 'Panel',
    agents: 'Agentes',
    adminPanel: 'Admin',
    settings: 'Configuración',
    signOut: 'Cerrar sesión',

    // Auth
    signIn: 'Iniciar sesión',
    signInTitle: 'Bienvenido de vuelta',
    signInSubtitle: 'Accede a tu cuenta de LeadFlux',
    email: 'Correo',
    password: 'Contraseña',
    emailPlaceholder: 'tu@empresa.com',
    passwordPlaceholder: '••••••••',
    signingIn: 'Ingresando...',
    invalidCredentials: 'Correo o contraseña inválidos',

    // Dashboard
    leads: 'Leads',
    allLeads: 'Todos los Leads',
    myLeads: 'Mis Leads',
    noLeads: 'Sin leads aún',
    noLeadsDesc: 'Los leads aparecerán aquí cuando sean asignados.',
    leadName: 'Nombre',
    leadEmail: 'Correo',
    leadPhone: 'Teléfono',
    assignedTo: 'Asignado a',
    status: 'Estado',
    responseTime: 'Tiempo resp.',
    createdAt: 'Creado',
    updateStatus: 'Actualizar estado',
    minutes: 'min',
    justAssigned: 'Recién asignado',

    // Status
    new: 'Nuevo',
    contacted: 'Contactado',
    closed: 'Cerrado',

    // Agents
    agentsList: 'Agentes',
    addAgent: 'Agregar agente',
    agentName: 'Nombre completo',
    agentNamePlaceholder: 'Juan Pérez',
    agentEmail: 'Correo electrónico',
    agentPassword: 'Contraseña',
    agentRole: 'Rol',
    roleAgent: 'Agente',
    roleAdmin: 'Admin',
    active: 'Activo',
    inactive: 'Inactivo',
    activate: 'Activar',
    deactivate: 'Desactivar',
    deleteAgent: 'Eliminar',
    confirmDelete: '¿Eliminar este agente?',
    creating: 'Creando...',
    createAgent: 'Crear agente',
    cancel: 'Cancelar',
    noAgents: 'Sin agentes aún',
    noAgentsDesc: 'Crea el primer agente para empezar a distribuir leads.',

    // Admin
    totalLeads: 'Total Leads',
    avgResponseTime: 'Tiempo prom. resp.',
    leaderboard: 'Clasificación',
    rank: 'Puesto',
    agent: 'Agente',
    totalAssigned: 'Asignados',
    contacted2: 'Contactados',
    closedLeads: 'Cerrados',
    assignmentType: 'Tipo de asignación',
    roundRobin: 'Round Robin',
    saveSettings: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',

    // Misc
    loading: 'Cargando...',
    error: 'Algo salió mal',
    retry: 'Reintentar',
    language: 'Idioma',
  }
}

export type TKey = keyof typeof translations.en
