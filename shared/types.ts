// shared/types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderateur' | 'utilisateur';
  dateCreation: Date;
  actif: boolean;
}

export interface Comment {
  id: string;
  auteur: string;
  contenu: string;
  date: Date;
  approuve: boolean;
  bdName: string;
  chapitreId: string;
  page?: number;
}

export interface BD {
  name: string;
  cover: {
    title: string;
    description: string;
    url: string;
  };
  chapitres: Record<string, Chapitre>;
}

export interface Chapitre {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  page: number;
  url: string;
}