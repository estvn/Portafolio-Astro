import type { ICertification, IDegree } from "../interfaces/Interface";

export const cvUrl = "/assets/archives/CV_Estiven_Mejia_Fullstack.pdf";

// Source of truth: the CV PDF (public/assets/archives/CV_Estiven_Mejia_Fullstack.pdf)
export const degree: IDegree = {
    title: "Ingeniería en Sistemas",
    title_en: "Systems Engineering",
    institution: "Universidad Nacional Autónoma de Honduras (UNAH)",
    date: "2020 - 2026",
    date_en: "2020 - 2026",
    location: "Tegucigalpa, Honduras",
    location_en: "Tegucigalpa, Honduras",
    skills: "Comunicación efectiva, trabajo en equipo, análisis y diseño de requisitos de negocio para sistemas empresariales. Implementación de herramientas de inteligencia de negocio: Datawarehouse, OLAP/OLTP, CRM, DSS/EIS.",
    skills_en: "Effective communication, teamwork, business requirements analysis and design for enterprise systems. Implementation of business intelligence tools: Data Warehouse, OLAP/OLTP, CRM, DSS/EIS.",
    language: "Inglés: Intermedio (B1)",
    language_en: "English: Intermediate (B1)",
};

const dir = "/assets/archives/certifications/";

export const certifications: ICertification[] = [
    {
        title: "Fundamentos de Java - Módulo 2",
        title_en: "Java Fundamentals - Module 2",
        issuer: "INFOP",
        date: "Agosto 2025",
        date_en: "August 2025",
    },
    {
        title: "Programador en Base de Datos con PL/SQL",
        title_en: "Database Programmer with PL/SQL",
        issuer: "INFOP",
        date: "Agosto 2025",
        date_en: "August 2025",
        pdf: dir + "Certificado_INFOP_Programador_Bases_Datos.pdf",
    },
    {
        title: "Diseño y Programación de Bases de Datos Oracle",
        title_en: "Oracle Database Design and Programming",
        issuer: "INFOP",
        date: "Noviembre 2024",
        date_en: "November 2024",
        pdf: dir + "Certificado_INFOP_Diseno_Programacion_Bases_Datos.pdf",
    },
    {
        title: "Conceptos Fundamentales de Java - Módulo 1",
        title_en: "Java Fundamental Concepts - Module 1",
        issuer: "INFOP",
        date: "Noviembre 2024",
        date_en: "November 2024",
        pdf: dir + "Certificado_INFOP_Fundamentos_Java.pdf",
    },
    {
        title: "Diseño de Bases de Datos Oracle",
        title_en: "Oracle Database Design",
        issuer: "INFOP",
        date: "Junio 2024",
        date_en: "June 2024",
        pdf: dir + "Certificado_INFOP_Diseno_Bases_Datos.pdf",
    },
    {
        title: "Fundamentos de Bases de Datos Oracle",
        title_en: "Oracle Database Fundamentals",
        issuer: "INFOP",
        date: "Junio 2024",
        date_en: "June 2024",
        pdf: dir + "Certificado_INFOP_Fundamentos_Bases_Datos.pdf",
    },
    {
        title: "Programa Oracle Next Education F2 T5 Back-end",
        title_en: "Oracle Next Education Program F2 T5 Back-end",
        issuer: "Alura Latam",
        date: "Septiembre 2023",
        date_en: "September 2023",
        pdf: dir + "BackEnd_AluraLatam.pdf",
    },
];
