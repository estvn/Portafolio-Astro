// Convention: Spanish is the base field, `*_en` holds the English version (falls back to Spanish).
export interface IProject {
    slug: string,
    title: string,
    description: string,
    technologies: string[],
}

export interface ITechnology {
    name: string,
    icon: string
}

export interface ITypeTechnology {
    type: string,
    type_en?: string,
    listTechnologies: ITechnology[],
}

export interface IGithub {
    name: string,
    url: string
}

export interface IProject {
    title: string,
    title_en?: string,
    description: string,
    description_en?: string,
    image: {
        url: string,
        alt: string
    },
    technologies: string[],
    url: string,
    category: 'work' | 'personal',
    links: {
        github: IGithub[],
        live: string
    }
}

export interface IExperienceInformation {
    title: string,
    title_en?: string,
    company: string,
    date: string, // Spanish ("Mayo 2022 - Marzo 2025"): Hero parses it to compute years of experience
    date_en?: string,
    certification: string,
    subtitle?: string,
    subtitle_en?: string,
    projects?: IExperienceProject[],
}

export interface IExperienceProject {
    name: string,
    name_en?: string,
    technologies: string[],
    bullets: string[], // **text** renders as highlighted
    bullets_en?: string[],
}

export interface IDegree {
    title: string,
    title_en: string,
    institution: string,
    date: string,
    date_en: string,
    location: string,
    location_en: string,
    skills: string,
    skills_en: string,
    language: string,
    language_en: string,
}

export interface ICertification {
    title: string,
    title_en: string,
    issuer: string,
    date: string,
    date_en: string,
    pdf?: string, // path under /assets/archives/certifications/ when the certificate file exists
}
