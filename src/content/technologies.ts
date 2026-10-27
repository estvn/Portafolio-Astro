import type { ITypeTechnology } from "../interfaces/Interface";

export const technologies: ITypeTechnology[] = [
    {
        type: "Backend",
        listTechnologies: [
            { name: "NestJS",         icon: "/assets/icons/nestjs-svgrepo-com.svg" },
            { name: "Node.js",        icon: "/assets/icons/nodejs.svg" },
            { name: "Laravel",        icon: "/assets/icons/laravel.svg" },
            //{ name: "Spring Boot",    icon: "/assets/icons/springboot.svg" },
            { name: "FastAPI",        icon: "/assets/icons/fastapi.svg" },
            { name: "PHP",            icon: "/assets/icons/php.svg" },
            { name: "Java",           icon: "/assets/icons/java.svg" },
            { name: "Python",         icon: "/assets/icons/python.svg" },
            { name: "GraphQL",        icon: "/assets/icons/graphql-icon.svg" },
        ]
    },
    {
        type: "Bases de Datos",
        listTechnologies: [
            { name: "Oracle PL/SQL",                   icon: "/assets/icons/oracle.svg" },
            { name: "SQL Server Transact-SQL",         icon: "/assets/icons/microsoftsqlserver.svg" },
            { name: "PostgreSQL",                      icon: "/assets/icons/postgresql-logo-svgrepo-com.svg" },
            { name: "Redis",                           icon: "/assets/icons/redis.svg" },
            { name: "MySQL",                           icon: "/assets/icons/mysql.svg" },
            // { name: "DB2",                          icon: "/assets/icons/db2.svg" },
        ]
    },
    {
        type: "Bussiness Intelligence",
        listTechnologies: [
            { name: "Power BI",                        icon: "/assets/icons/powerbi-svgrepo-com.svg" },
            { name: "Data Warehouse",                  icon: "/assets/icons/data-warehouse.png" },
            { name: "Tableau",                         icon: "/assets/icons/tableau.svg" }
        ]
    },
    {
        type: "Infraestructura",
        listTechnologies: [
            //{ name: "Microservicios", icon: "/assets/icons/microservicio.png" },
            //{ name: "Serverless",     icon: "/assets/icons/serverless.svg" },
            { name: "Docker",         icon: "/assets/icons/docker.svg" },
            { name: "Terraform",      icon: "/assets/icons/terraform.svg" },
            { name: "Azure Cloud",    icon: "/assets/icons/azure.svg" },
        ]
    },
    {
        type: "Frontend",
        listTechnologies: [
            { name: "Next.js",        icon: "/assets/icons/nextjs.svg" },
            { name: "React",          icon: "/assets/icons/react.svg" },
            { name: "Astro",          icon: "/assets/icons/astro.svg" },
            { name: "TypeScript",     icon: "/assets/icons/typescript.svg" },
            { name: "JavaScript",     icon: "/assets/icons/javascript.svg" },
            //{ name: "Tailwind CSS",   icon: "/assets/icons/tailwindcss.svg" },
            //{ name: "Bootstrap",      icon: "/assets/icons/bootstrap.svg" },
            // { name: "jQuery",      icon: "/assets/icons/jquery.png" }
        ]
    },

    /*
    {
        type: "QA & Documentación",
        listTechnologies: [
            { name: "Jira",           icon: "/assets/icons/jira.svg" },
            { name: "Swagger",        icon: "/assets/icons/swagger.svg" },
            { name: "Postman",        icon: "/assets/icons/postman.svg" },
            { name: "Insomnia",        icon: "/assets/icons/insomnia-svgrepo-com.svg" }
            
        ]
    },
    {
        type: "Otros",
        listTechnologies: [
            { name: "Linux",          icon: "/assets/icons/linux-svgrepo-com.svg" },
            { name: "Git & GitHub",   icon: "/assets/icons/github.svg" },
            { name: "Figma",          icon: "/assets/icons/figma.svg" },
            { name: "Snort",          icon: "/assets/icons/snort.svg" },
            { name: "Wireshark",      icon: "/assets/icons/wireshark.svg" },
        ]
    }
    */
];
