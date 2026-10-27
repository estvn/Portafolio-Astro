import type { IExperienceInformation } from "../interfaces/Interface";

// Spanish is the base; `*_en` fields hold the English text. `date` must stay Spanish (Hero parses it).
export const experienceInformation: IExperienceInformation[] = [
    {
        title: "Backend Developer | Consultor",
        title_en: "Backend Developer | Consultant",
        subtitle: "ETL, bases de datos y APIs REST",
        subtitle_en: "ETL, databases and REST APIs",
        company: "Oncorp",
        date: "Octubre 2025 - Actualidad",
        date_en: "October 2025 - Present",
        certification: "",
        projects: [
            {
                name: "Colegio de Químicos Farmacéuticos (CQFH)",
                name_en: "Honduran Pharmaceutical Chemists Association (CQFH)",
                technologies: ["Laravel", "SSIS", "Python", "SQL Server", "API REST"],
                bullets: [
                    "Construí procesos ETL con SSIS y Python que limpian, transforman y cargan **más de 100 mil registros** desde Excel a la base de datos.",
                    "Diseñé **procedimientos almacenados, vistas y funciones** para consolidar y consultar la información cargada.",
                    "Desarrollé una **API REST** conectada a la base de datos para exponer la información al sistema.",
                ],
                bullets_en: [
                    "Built ETL processes with SSIS and Python that clean, transform and load **more than 100k records** from Excel into the database.",
                    "Designed **stored procedures, views and functions** to consolidate and query the loaded data.",
                    "Developed a **REST API** connected to the database to expose the information to the system.",
                ],
            },
            {
                name: "BANADESA (CINOP) - Transferencias Monetarias Condicionadas",
                name_en: "BANADESA (CINOP) - Conditional Cash Transfers",
                technologies: ["NestJS", "PostgreSQL", "Redis", "Linux", "Docker", "Dokploy", "VPS", "API REST"],
                bullets: [
                    "Implementé **aislamiento de datos por institución** con un esquema separado por cada una (single tenant) y control de acceso por roles.",
                    "Desarrollé el frontend y la API REST conectada a la base de datos y a caché para el **sistema de gestión de pagos** de las transferencias.",
                    "Integré **impresoras y lectores de huella** al sistema web mediante una API local y el SDK del dispositivo.",
                    "Administré el **despliegue en servidor VPS con contenedores** (Docker y Dokploy) para operar y administrar las aplicaciones.",
                ],
                bullets_en: [
                    "Implemented **per-institution data isolation** with a separate schema for each one (single tenant) and role-based access control.",
                    "Built the frontend and the REST API connected to the database and cache for the transfers **payment management system**.",
                    "Integrated **printers and fingerprint readers** into the web system through a local API and the device SDK.",
                    "Managed the **deployment on a VPS server with containers** (Docker and Dokploy) to run and administer the applications.",
                ],
            },
        ],
    },
    {
        title: "Fullstack Developer | Práctica",
        title_en: "Fullstack Developer | Internship",
        subtitle: "Seguimiento de campo y analítica",
        subtitle_en: "Field tracking and analytics",
        company: "NACEL",
        date: "Octubre 2025 - Febrero 2026",
        date_en: "October 2025 - February 2026",
        certification: "",
        projects: [
            {
                name: "Sistema de tracking de trabajo en campo (instalación de torres)",
                name_en: "Field work tracking system (tower installation)",
                technologies: ["NestJS", "Redis", "MySQL", "Arquitectura hexagonal", "GitHub Actions"],
                bullets: [
                    "Desarrollé un **gestor de proyectos** para la instalación de torres de telecomunicaciones, con frontend y API REST en **NestJS** bajo **arquitectura hexagonal**.",
                    "Integré una **API externa de tracking de campo** y almacené su data en una base de datos normalizada.",
                    "Automaticé las pruebas y el despliegue continuo (**CI/CD con GitHub Actions**).",
                ],
                bullets_en: [
                    "Built a **project manager** for telecom tower installation, with a frontend and REST API in **NestJS** following **hexagonal architecture**.",
                    "Integrated an **external field-tracking API** and stored its data in a normalized database.",
                    "Automated testing and continuous deployment (**CI/CD with GitHub Actions**).",
                ],
            },
            {
                name: "Dashboards Power BI - Eficiencia operativa y control de costos",
                name_en: "Power BI Dashboards - Operational efficiency and cost control",
                technologies: ["Power BI", "Excel", "MySQL"],
                bullets: [
                    "Diseñé **dashboards ejecutivos en Power BI con actualización programada**, integrados con **Excel** y con la base de datos transaccional del sistema de tracking.",
                    "Construí indicadores de eficiencia en campo: **avance por proyecto y productividad por cuadrilla**.",
                    "Identifiqué las **categorías y etapas donde se concentra el mayor gasto** para priorizar acciones de optimización.",
                ],
                bullets_en: [
                    "Designed **executive Power BI dashboards with scheduled refresh**, integrated with **Excel** and the tracking system's transactional database.",
                    "Built field efficiency indicators: **progress per project and productivity per crew**.",
                    "Identified the **categories and stages where spending concentrates** to prioritize optimization actions.",
                ],
            },
        ],
    },
    {
        title: "Analista y Desarrollador Fullstack | Consultor",
        title_en: "Analyst and Fullstack Developer | Consultant",
        subtitle: "Sistemas web a la medida para clientes de diferentes sectores",
        subtitle_en: "Custom web systems for clients across different sectors",
        company: "Zsystems",
        date: "Mayo 2022 - Marzo 2025",
        date_en: "May 2022 - March 2025",
        certification: "",
        projects: [
            {
                name: "Sistema contable - Iglesia Pentecostal",
                name_en: "Accounting system - Pentecostal Church",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Diseñé una **base de datos multitenant** que separa lógicamente la data de cada institución.",
                    "Desarrollé el sistema web de contabilidad **usado por una red de más de 140 instituciones**.",
                    "Levanté requerimientos y desarrollé el backend con patrón MVC.",
                ],
                bullets_en: [
                    "Designed a **multi-tenant database** that logically separates each institution's data.",
                    "Built the web accounting system, **used by a network of more than 140 institutions**.",
                    "Gathered requirements and built the backend using the MVC pattern.",
                ],
            },
            {
                name: "Gestión de inventario - Taller Industrial",
                name_en: "Inventory management - Industrial Workshop",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Diseñé una **base de datos normalizada** que garantiza integridad y consistencia de productos, proveedores y movimientos.",
                    "Desarrollé el control de existencias con **entradas, salidas y trazabilidad del historial** por producto, más catálogo y alertas de stock mínimo.",
                    "Generé reportes de inventario y de movimientos, y desarrollé el backend con patrón MVC.",
                ],
                bullets_en: [
                    "Designed a **normalized database** that ensures integrity and consistency of products, suppliers and movements.",
                    "Built stock control with **inbound, outbound and movement-history traceability** per product, plus a catalog and minimum-stock alerts.",
                    "Produced inventory and movement reports, and built the backend using the MVC pattern.",
                ],
            },
            {
                name: "Gestión de citas médicas - Hospital Oncológico",
                name_en: "Medical appointment management - Oncology Hospital",
                technologies: ["Javascript", "PHP", "MySQL"],
                bullets: [
                    "Modelé la base de datos y programé el backend con patrón MVC.",
                    "Levanté requerimientos y desarrollé el sistema de agendamiento de citas médicas, **en producción**.",
                ],
                bullets_en: [
                    "Modeled the database and programmed the backend using the MVC pattern.",
                    "Gathered requirements and built the medical appointment scheduling system, **in production**.",
                ],
            },
        ],
    },
]
