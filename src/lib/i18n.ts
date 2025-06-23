
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Owners Cockpit',
        welcome: 'Welcome to Owners Cockpit',
        enterApp: 'Enter App',
        selectProject: 'Select a project to start chatting with your AI construction assistant.'
      },
      navigation: {
        settings: 'Settings',
        upload: 'Upload',
        projects: 'Projects'
      },
      insights: {
        title: 'Project Insights',
        budget: 'Budget',
        schedule: 'Schedule',
        documents: 'Documents',
        riskAlerts: 'Risk Alerts',
        quickActions: 'Quick Actions',
        spent: 'Spent',
        remaining: 'Remaining',
        completed: 'Completed',
        upcoming: 'Upcoming',
        total: 'Total',
        addedThisWeek: 'Added this week',
        needReview: 'need review',
        tasksOverdue: 'tasks overdue',
        overBudget: 'over budget',
        daysAgo: 'days ago',
        generateReport: 'Generate Report',
        scheduleReview: 'Schedule Review',
        budgetAnalysis: 'Budget Analysis'
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        timezone: 'Timezone',
        selectLanguage: 'Select Language',
        selectTimezone: 'Select Timezone',
        english: 'English',
        spanish: 'Spanish'
      },
      severity: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        critical: 'Critical'
      }
    }
  },
  es: {
    translation: {
      app: {
        title: 'Cabina del Propietario',
        welcome: 'Bienvenido a Cabina del Propietario',
        enterApp: 'Entrar a la App',
        selectProject: 'Selecciona un proyecto para comenzar a chatear con tu asistente de construcción IA.'
      },
      navigation: {
        settings: 'Configuración',
        upload: 'Subir',
        projects: 'Proyectos'
      },
      insights: {
        title: 'Perspectivas del Proyecto',
        budget: 'Presupuesto',
        schedule: 'Cronograma',
        documents: 'Documentos',
        riskAlerts: 'Alertas de Riesgo',
        quickActions: 'Acciones Rápidas',
        spent: 'Gastado',
        remaining: 'Restante',
        completed: 'Completado',
        upcoming: 'Próximo',
        total: 'Total',
        addedThisWeek: 'Agregado esta semana',
        needReview: 'necesitan revisión',
        tasksOverdue: 'tareas vencidas',
        overBudget: 'sobre presupuesto',
        daysAgo: 'días atrás',
        generateReport: 'Generar Reporte',
        scheduleReview: 'Programar Revisión',
        budgetAnalysis: 'Análisis de Presupuesto'
      },
      settings: {
        title: 'Configuración',
        language: 'Idioma',
        timezone: 'Zona Horaria',
        selectLanguage: 'Seleccionar Idioma',
        selectTimezone: 'Seleccionar Zona Horaria',
        english: 'Inglés',
        spanish: 'Español'
      },
      severity: {
        high: 'Alto',
        medium: 'Medio',
        low: 'Bajo',
        critical: 'Crítico'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
