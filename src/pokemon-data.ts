export interface Pokemon {
    moves: any;
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }[];
    abilities: {
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
        slot: number;
    }[];
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }[];
    sprites: {
        front_default: string | null;
        other?: {
            ['official-artwork']?: {
                front_default: string | null;
            };
        };
    };
    species: {
        name: string;
        url: string;
    };
}

  // --- สำหรับการจัดทีมแข่งขัน ---
  export interface TeamSuggestionResult {
    main: {
      name: string;
      types: string[];
    };
    teammates: {
      name: string;
      role: string;
    }[];
    strategy: string;
    references: {
      pikalytics?: string;
      smogon?: string;
    };
  }  

  export interface PikalyticsAPIResponse {
    usage?: string;
    teammates?: { name: string }[];
  }