import type { IExperienceInformation } from "../interfaces/Interface";

export const experienceInformation: IExperienceInformation[] = [
    {
        title: "Backend Developer | Consultor",
        subtitle: "ETL, bases de datos y APIs REST",
        company: "Oncorp",
        date: "Octubre 2025 - Actualidad",
        certification: "",
        projects: [
            {
                name: "Colegio de Químicos Farmacéuticos (CQFH)",
                technologies: ["Laravel", "SSIS", "Python", "SQL Server", "API REST"],
                bullets: [
                    "Construí procesos ETL con SSIS y Python que limpian, transforman y cargan **más de 100 mil registros** desde Excel a la base de datos.",
                    "Diseñé **procedimientos almacenados, vistas y funciones** para consolidar y consultar la información cargada.",
                    "Desarrollé una **API REST** conectada a la base de datos para exponer la información al sistema.",
                ],
            },
            {
                name: "BANADESA (CINOP) - Transferencias Monetarias Condicionadas",
                technologies: ["NestJS", "PostgreSQL", "Redis", "Linux", "Docker", "Dokploy", "VPS", "API REST"],
                bullets: [
                    "Implementé **aislamiento de datos por institución** con un esquema separado por cada una (single tenant) y control de acceso por roles.",
                    "Desarrollé el frontend y la API REST conectada a la base de datos y a caché para el **sistema de gestión de pagos** de las transferencias.",
                    "Integré **impresoras y lectores de huella** al sistema web mediante una API local y el SDK del dispositivo.",
                    "Administré el **despliegue en servidor VPS con contenedores** (Docker y Dokploy) para operar y administrar las aplicaciones.",
                ],
            },
        ],
    },
    {
        title: "Fullstack Developer | Práctica",
        subtitle: "Seguimiento de campo y analítica",
        company: "NACEL",
        date: "Octubre 2025 - Febrero 2026",
        certification: "",
        projects: [
            {
                name: "Sistema de tracking de trabajo en campo (instalación de torres)",
                technologies: ["NestJS", "Redis", "MySQL", "Arquitectura hexagonal", "GitHub Actions"],
                bullets: [
                    "Desarrollé un **gestor de proyectos** para la instalación de torres de telecomunicaciones, con frontend y API REST en **NestJS** bajo **arquitectura hexagonal**.",
                    "Integré una **API externa de tracking de campo** y almacené su data en una base de datos normalizada.",
                    "Automaticé las pruebas y el despliegue continuo (**CI/CD con GitHub Actions**).",
                ],
            },
            {
                name: "Dashboards Power BI - Eficiencia operativa y control de costos",
                technologies: ["Power BI", "Excel", "MySQL"],
                bullets: [
                    "Diseñé **dashboards ejecutivos en Power BI con actualización programada**, integrados con **Excel** y con la base de datos transaccional del sistema de tracking.",
                    "Construí indicadores de eficiencia en campo: **avance por proyecto y productividad por cuadrilla**.",
                    "Identifiqué las **categorías y etapas donde se concentra el mayor gasto** para priorizar acciones de optimización.",
                ],
            },
        ],
    },
    {
        title: "Analista y Desarrollador Fullstack | Consultor",
        subtitle: "Sistemas web a la medida para clientes de diferentes sectores",
        company: "Zsystems",
        date: "Mayo 2022 - Marzo 2025",
        certification: "",
        projects: [
            {
                name: "Sistema contable - Iglesia Pentecostal",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Diseñé una **base de datos multitenant** que separa lógicamente la data de cada institución.",
                    "Desarrollé el sistema web de contabilidad **usado por una red de más de 140 instituciones**.",
                    "Levanté requerimientos y desarrollé el backend con patrón MVC.",
                ],
            },
            {
                name: "Gestión de inventario - Taller Industrial",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Diseñé una **base de datos normalizada** que garantiza integridad y consistencia de productos, proveedores y movimientos.",
                    "Desarrollé el control de existencias con **entradas, salidas y trazabilidad del historial** por producto, más catálogo y alertas de stock mínimo.",
                    "Generé reportes de inventario y de movimientos, y desarrollé el backend con patrón MVC.",
                ],
            },
            {
                name: "Gestión de citas médicas - Hospital Oncológico",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Modelé la base de datos y programé el backend con patrón MVC.",
                    "Levanté requerimientos y desarrollé el sistema de agendamiento de citas médicas, **en producción**.",
                ],
            },
        ],
    },
]
