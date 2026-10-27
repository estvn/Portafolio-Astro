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
    listTechnologies: ITechnology[],
}

export interface IGithub {
    name: string,
    url: string
}

export interface IProject {
    title: string,
    description: string,
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
    company: string,
    date: string,
    certification: string,
    subtitle?: string,
    projects?: IExperienceProject[],
}

export interface IExperienceProject {
    name: string,
    technologies: string[],
    bullets: string[], // **text** renders as highlighted
}
